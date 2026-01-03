-- API Key Management System
-- Enables developer API access with key generation, rotation, and usage tracking

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(8) NOT NULL, -- First 8 chars of the key for identification (e.g., "alw_sk_")
    key_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of the full key
    scopes TEXT[] DEFAULT ARRAY['read']::TEXT[], -- Permissions: read, write, delete, admin
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_day INTEGER DEFAULT 10000,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Key Usage tracking
CREATE TABLE IF NOT EXISTS api_key_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_org_id ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_api_key_usage_key_id ON api_key_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_created ON api_key_usage(created_at);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_keys
CREATE POLICY "Users can view own API keys"
    ON api_keys FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create own API keys"
    ON api_keys FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own API keys"
    ON api_keys FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own API keys"
    ON api_keys FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- RLS Policies for api_key_usage
CREATE POLICY "Users can view usage for own API keys"
    ON api_key_usage FOR SELECT
    TO authenticated
    USING (api_key_id IN (SELECT id FROM api_keys WHERE user_id = auth.uid()));

-- Function to validate API key
CREATE OR REPLACE FUNCTION validate_api_key(p_key_hash VARCHAR(64))
RETURNS TABLE(
    key_id UUID,
    user_id UUID,
    organization_id UUID,
    scopes TEXT[],
    rate_limit_per_minute INTEGER,
    rate_limit_per_day INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        k.id,
        k.user_id,
        k.organization_id,
        k.scopes,
        k.rate_limit_per_minute,
        k.rate_limit_per_day
    FROM api_keys k
    WHERE k.key_hash = p_key_hash
      AND k.is_active = true
      AND (k.expires_at IS NULL OR k.expires_at > NOW());
    
    -- Update last_used_at
    UPDATE api_keys SET last_used_at = NOW() WHERE key_hash = p_key_hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log API key usage
CREATE OR REPLACE FUNCTION log_api_key_usage(
    p_key_id UUID,
    p_endpoint VARCHAR(255),
    p_method VARCHAR(10),
    p_status_code INTEGER,
    p_response_time_ms INTEGER,
    p_ip_address INET,
    p_user_agent TEXT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO api_key_usage (
        api_key_id, endpoint, method, status_code, 
        response_time_ms, ip_address, user_agent
    ) VALUES (
        p_key_id, p_endpoint, p_method, p_status_code,
        p_response_time_ms, p_ip_address, p_user_agent
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get API key usage stats
CREATE OR REPLACE FUNCTION get_api_key_stats(p_key_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE(
    total_requests BIGINT,
    successful_requests BIGINT,
    failed_requests BIGINT,
    avg_response_time NUMERIC,
    requests_by_day JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT AS total_requests,
        COUNT(*) FILTER (WHERE status_code >= 200 AND status_code < 300)::BIGINT AS successful_requests,
        COUNT(*) FILTER (WHERE status_code >= 400)::BIGINT AS failed_requests,
        ROUND(AVG(response_time_ms)::NUMERIC, 2) AS avg_response_time,
        json_agg(json_build_object(
            'date', day::DATE,
            'count', day_count
        )) AS requests_by_day
    FROM api_key_usage
    LEFT JOIN LATERAL (
        SELECT 
            date_trunc('day', created_at) AS day,
            COUNT(*) AS day_count
        FROM api_key_usage u2
        WHERE u2.api_key_id = p_key_id
          AND u2.created_at >= NOW() - (p_days || ' days')::INTERVAL
        GROUP BY date_trunc('day', created_at)
    ) daily ON true
    WHERE api_key_id = p_key_id
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

