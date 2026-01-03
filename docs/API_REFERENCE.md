# API Reference

> Last verified: 2025-12-09

Complete reference for all Alawein Platform Edge Function APIs.

---

## Overview

All APIs are Supabase Edge Functions deployed at:

```
https://hfbexbargmskuwybaucz.supabase.co/functions/v1/{function-name}
```

### Authentication

All endpoints require a valid JWT token in the Authorization header:

```typescript
const { data, error } = await supabase.functions.invoke('simcore-api', {
  body: { path: '/simulations', method: 'GET' },
});
// Token is automatically included via Supabase client
```

### Common Headers

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};
```

### Error Response Format

```typescript
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional context"
}
```

| HTTP Status | Meaning                                 |
| ----------- | --------------------------------------- |
| 200         | Success                                 |
| 400         | Bad Request - Invalid input             |
| 401         | Unauthorized - Missing or invalid token |
| 403         | Forbidden - Insufficient permissions    |
| 404         | Not Found - Resource doesn't exist      |
| 500         | Internal Server Error                   |

---

## SimCore API

**Base URL**: `/functions/v1/simcore-api` **Database Table**:
`simcore_simulations`

### GET /simulations

List all simulations for the authenticated user.

**Response**

```typescript
{
  "simulations": [
    {
      "id": "uuid",
      "name": "Fluid Dynamics Test",
      "simulation_type": "fluid" | "particle" | "thermal",
      "status": "pending" | "running" | "completed" | "failed",
      "progress": 0-100,
      "config": {
        "particles": 1000,
        "timestep": 0.01,
        "duration": 100
      },
      "results": { ... },
      "started_at": "ISO-8601",
      "completed_at": "ISO-8601",
      "created_at": "ISO-8601",
      "updated_at": "ISO-8601"
    }
  ]
}
```

**Example**

```typescript
const { data } = await supabase.functions.invoke('simcore-api', {
  body: { path: '/simulations', method: 'GET' },
});
console.log(data.simulations);
```

### POST /simulations

Create a new simulation.

**Request Body**

```typescript
{
  "name": "My Simulation",
  "simulation_type": "particle",
  "config": {
    "particles": 1000,
    "timestep": 0.01,
    "duration": 100
  }
}
```

**Response**

```typescript
{
  "simulation": {
    "id": "uuid",
    "name": "My Simulation",
    "status": "pending",
    ...
  }
}
```

### GET /simulations/:id

Get a specific simulation by ID.

### PUT /simulations/:id

Update simulation configuration.

### DELETE /simulations/:id

Delete a simulation.

### GET /stats

Get simulation statistics for the user.

**Response**

```typescript
{
  "total": 42,
  "running": 2,
  "completed": 35,
  "failed": 5,
  "avg_duration_ms": 45000
}
```

---

## MEZAN API

**Base URL**: `/functions/v1/mezan-api` **Database Table**: `mezan_workflows`

### GET /workflows

List all workflows for the authenticated user.

**Response**

```typescript
{
  "workflows": [
    {
      "id": "uuid",
      "name": "Data Sync Pipeline",
      "description": "Syncs data from source to destination",
      "status": "active" | "draft" | "paused",
      "workflow_definition": {
        "nodes": [
          { "id": "1", "type": "trigger", "data": { ... } },
          { "id": "2", "type": "action", "data": { ... } }
        ],
        "edges": [
          { "source": "1", "target": "2" }
        ]
      },
      "execution_count": 42,
      "success_rate": 98.5,
      "last_executed_at": "ISO-8601",
      "created_at": "ISO-8601",
      "updated_at": "ISO-8601"
    }
  ]
}
```

### POST /workflows

Create a new workflow.

**Request Body**

```typescript
{
  "name": "New Workflow",
  "description": "Optional description",
  "workflow_definition": {
    "nodes": [...],
    "edges": [...]
  }
}
```

### PUT /workflows/:id

Update workflow definition.

### DELETE /workflows/:id

Delete a workflow.

### POST /execute

Execute a workflow.

**Request Body**

```typescript
{
  "workflow_id": "uuid",
  "input": { ... }  // Optional input data
}
```

**Response**

```typescript
{
  "execution_id": "uuid",
  "status": "started",
  "workflow_id": "uuid"
}
```

### GET /stats

Get workflow statistics.

---

## TalAI API

**Base URL**: `/functions/v1/talai-api` **Database Table**: `talai_experiments`

### GET /experiments

List ML experiments.

**Response**

```typescript
{
  "experiments": [
    {
      "id": "uuid",
      "name": "BERT Fine-tuning",
      "model_type": "transformer" | "cnn" | "rnn" | "gan",
      "status": "created" | "training" | "completed" | "failed",
      "progress": 0-100,
      "hyperparameters": {
        "learning_rate": 0.001,
        "batch_size": 32,
        "epochs": 100,
        "optimizer": "adam"
      },
      "metrics": {
        "loss": 0.234,
        "accuracy": 0.89,
        "val_loss": 0.256,
        "val_accuracy": 0.87
      },
      "started_at": "ISO-8601",
      "completed_at": "ISO-8601",
      "created_at": "ISO-8601",
      "updated_at": "ISO-8601"
    }
  ]
}
```

### POST /experiments

Create a new experiment.

**Request Body**

```typescript
{
  "name": "My Experiment",
  "model_type": "transformer",
  "hyperparameters": {
    "learning_rate": 0.001,
    "batch_size": 32,
    "epochs": 100
  }
}
```

### POST /train

Start training an experiment.

**Request Body**

```typescript
{
  "experiment_id": "uuid"
}
```

### GET /stats

Get experiment statistics.

---

## OptiLibria API

**Base URL**: `/functions/v1/optilibria-api` **Database Table**:
`optilibria_runs`

### GET /runs

List optimization runs.

**Response**

```typescript
{
  "runs": [
    {
      "id": "uuid",
      "problem_name": "Traveling Salesman",
      "algorithm": "genetic" | "ant_colony" | "simulated_annealing" | ...,
      "status": "pending" | "running" | "completed" | "failed",
      "best_score": 245.67,
      "iterations": 1000,
      "config": {
        "population_size": 100,
        "max_iterations": 500,
        "mutation_rate": 0.1
      },
      "results": {
        "convergence_history": [...],
        "best_solution": [...]
      },
      "started_at": "ISO-8601",
      "completed_at": "ISO-8601",
      "created_at": "ISO-8601",
      "updated_at": "ISO-8601"
    }
  ]
}
```

### POST /runs

Create a new optimization run.

**Request Body**

```typescript
{
  "problem_name": "TSP-50",
  "algorithm": "ant_colony",
  "config": {
    "population_size": 100,
    "max_iterations": 500
  }
}
```

### GET /algorithms

List available optimization algorithms (31+).

**Response**

```typescript
{
  "algorithms": [
    {
      "id": "genetic",
      "name": "Genetic Algorithm",
      "category": "evolutionary",
      "description": "Nature-inspired optimization"
    },
    {
      "id": "ant_colony",
      "name": "Ant Colony Optimization",
      "category": "swarm",
      "description": "Pheromone-based path finding"
    },
    // ... 29+ more
  ]
}
```

### GET /stats

Get optimization statistics.

---

## QMLab API

**Base URL**: `/functions/v1/qmlab-api` **Database Table**: `qmlab_experiments`

### GET /experiments

List quantum experiments.

**Response**

```typescript
{
  "experiments": [
    {
      "id": "uuid",
      "name": "Hydrogen Atom",
      "quantum_system": "hydrogen" | "helium" | "harmonic_oscillator" | "particle_in_box",
      "particle_count": 1,
      "wave_function_data": {
        "psi": [...],
        "probability_density": [...],
        "energy_levels": [...]
      },
      "measurement_results": {
        "position": [...],
        "momentum": [...],
        "energy": 13.6
      },
      "status": "created" | "computing" | "completed",
      "created_at": "ISO-8601",
      "updated_at": "ISO-8601"
    }
  ]
}
```

### POST /experiments

Create a new quantum experiment.

**Request Body**

```typescript
{
  "name": "My Experiment",
  "quantum_system": "hydrogen",
  "particle_count": 1
}
```

### POST /wavefunction

Generate wave function visualization.

**Request Body**

```typescript
{
  "experiment_id": "uuid",
  "resolution": 100,
  "dimensions": 2
}
```

**Response**

```typescript
{
  "wave_function": {
    "x": [...],
    "y": [...],
    "psi_real": [...],
    "psi_imag": [...],
    "probability": [...]
  }
}
```

### GET /stats

Get lab statistics.

---

## Frontend Integration

### Using TanStack Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fetch simulations
export function useSimulations() {
  return useQuery({
    queryKey: ['simulations'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('simcore-api', {
        body: { path: '/simulations', method: 'GET' },
      });
      if (error) throw error;
      return data.simulations;
    },
  });
}

// Create simulation
export function useCreateSimulation() {
  return useMutation({
    mutationFn: async (simulation: CreateSimulationInput) => {
      const { data, error } = await supabase.functions.invoke('simcore-api', {
        body: {
          path: '/simulations',
          method: 'POST',
          data: simulation,
        },
      });
      if (error) throw error;
      return data.simulation;
    },
  });
}
```

### Direct Database Access

For simple CRUD, you can use Supabase client directly:

```typescript
// Fetch from table
const { data, error } = await supabase
  .from('simcore_simulations')
  .select('*')
  .eq('user_id', userId);

// Insert
const { data, error } = await supabase
  .from('simcore_simulations')
  .insert({ name: 'New Sim', simulation_type: 'particle', user_id: userId });

// Update
const { data, error } = await supabase
  .from('simcore_simulations')
  .update({ status: 'completed' })
  .eq('id', simId);

// Delete
const { error } = await supabase
  .from('simcore_simulations')
  .delete()
  .eq('id', simId);
```

---

## Rate Limiting

| Tier       | Requests/min | Burst |
| ---------- | ------------ | ----- |
| Free       | 60           | 10    |
| Pro        | 300          | 50    |
| Enterprise | Unlimited    | 100   |

Rate limit headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1699999999
```

---

## Database Schema Reference

See [ERD Documentation](./ERD.md) for complete schema details.

### Quick Reference

| Table                 | Primary Key | Foreign Key |
| --------------------- | ----------- | ----------- |
| `simcore_simulations` | `id`        | `user_id`   |
| `mezan_workflows`     | `id`        | `user_id`   |
| `talai_experiments`   | `id`        | `user_id`   |
| `optilibria_runs`     | `id`        | `user_id`   |
| `qmlab_experiments`   | `id`        | `user_id`   |

All tables have Row Level Security (RLS) enabled. Users can only access their
own data.

---

## Related Documentation

- [APIS.md](./APIS.md) - Concise API overview
- [ERD.md](./ERD.md) - Database schema
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
