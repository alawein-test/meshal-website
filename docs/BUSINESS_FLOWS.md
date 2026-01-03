# Business Flows

> Last verified: 2025-12-09

User journey and process diagrams for key platform operations.

---

## Table of Contents

1. Authentication Flow
2. Simulation Creation (SimCore)
3. Workflow Execution (MEZAN)
4. AI Experiment (TalAI)
5. Optimization Run (OptiLibria)
6. Quantum Experiment (QMLab)

---

## Authentication Flow

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant LoginForm
    participant AuthStore
    participant Supabase
    participant Database

    User->>LoginForm: Enter credentials
    LoginForm->>AuthStore: signIn(email, password)
    AuthStore->>Supabase: auth.signInWithPassword()
    Supabase->>Database: Validate credentials

    alt Valid credentials
        Database-->>Supabase: User record
        Supabase-->>AuthStore: Session + User
        AuthStore->>AuthStore: setUser(user)
        AuthStore-->>LoginForm: Success
        LoginForm-->>User: Redirect to dashboard
    else Invalid credentials
        Database-->>Supabase: Error
        Supabase-->>AuthStore: AuthError
        AuthStore-->>LoginForm: Error message
        LoginForm-->>User: Show error toast
    end
```

### Flowchart

```mermaid
flowchart TD
    A[User visits /auth] --> B{Already authenticated?}
    B -->|Yes| C[Redirect to previous page]
    B -->|No| D[Show Login/Signup Form]

    D --> E{Login or Signup?}
    E -->|Login| F[Enter email + password]
    E -->|Signup| G[Enter email + password + confirm]

    F --> H[Submit login]
    G --> I[Submit signup]

    H --> J{Valid credentials?}
    I --> K{Valid input?}

    J -->|Yes| L[Create session]
    J -->|No| M[Show error]
    M --> F

    K -->|Yes| N[Create account]
    K -->|No| O[Show validation error]
    O --> G

    N --> P{Account created?}
    P -->|Yes| L
    P -->|No| Q[Show error - email exists?]
    Q --> G

    L --> R[Store session in AuthStore]
    R --> S[Redirect to dashboard]
```

---

## Simulation Creation (SimCore)

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant SimControls
    participant useSimulations
    participant EdgeFunction
    participant Database

    User->>Dashboard: Click "New Simulation"
    Dashboard->>SimControls: Open configuration panel

    User->>SimControls: Configure parameters
    Note over SimControls: name, type, config

    SimControls->>useSimulations: createSimulation(data)
    useSimulations->>EdgeFunction: POST /simcore-api
    EdgeFunction->>Database: INSERT simcore_simulations
    Database-->>EdgeFunction: New record
    EdgeFunction-->>useSimulations: Simulation created

    useSimulations->>useSimulations: Invalidate query cache
    useSimulations-->>Dashboard: Refresh list
    Dashboard-->>User: Show new simulation

    User->>Dashboard: Click "Run"
    Dashboard->>EdgeFunction: POST /simcore-api (run)
    EdgeFunction->>EdgeFunction: Execute simulation
    EdgeFunction->>Database: UPDATE status, progress

    loop Progress updates
        Database-->>Dashboard: Realtime update
        Dashboard-->>User: Show progress
    end

    EdgeFunction->>Database: UPDATE results, completed_at
    Database-->>Dashboard: Final update
    Dashboard-->>User: Show results
```

### Flowchart

```mermaid
flowchart TD
    A[User opens SimCore] --> B[Load existing simulations]
    B --> C{Has simulations?}

    C -->|No| D[Show empty state]
    C -->|Yes| E[Display simulation list]

    D --> F[Click "Create First Simulation"]
    E --> G[Click "New Simulation"]

    F --> H[Open configuration panel]
    G --> H

    H --> I[Enter simulation name]
    I --> J[Select simulation type]
    J --> K[Configure parameters]
    K --> L[Click "Create"]

    L --> M{Valid configuration?}
    M -->|No| N[Show validation error]
    N --> K

    M -->|Yes| O[Save to database]
    O --> P[Simulation created - pending]

    P --> Q{Run immediately?}
    Q -->|No| R[Return to list]
    Q -->|Yes| S[Start simulation]

    S --> T[Status: running]
    T --> U[Process simulation]
    U --> V{Completed?}

    V -->|Error| W[Status: failed]
    V -->|Success| X[Status: completed]

    W --> Y[Show error details]
    X --> Z[Display results chart]
```

---

## Workflow Execution (MEZAN)

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant WorkflowEditor
    participant useWorkflows
    participant EdgeFunction
    participant Database

    User->>Dashboard: View workflows
    Dashboard->>useWorkflows: fetchWorkflows()
    useWorkflows->>Database: SELECT from mezan_workflows
    Database-->>useWorkflows: Workflow list
    useWorkflows-->>Dashboard: Display workflows

    User->>Dashboard: Click "Edit Workflow"
    Dashboard->>WorkflowEditor: Open with workflow data

    User->>WorkflowEditor: Modify workflow definition
    WorkflowEditor->>useWorkflows: updateWorkflow(id, data)
    useWorkflows->>Database: UPDATE mezan_workflows
    Database-->>useWorkflows: Updated record

    User->>Dashboard: Click "Execute"
    Dashboard->>EdgeFunction: POST /mezan-api (execute)
    EdgeFunction->>EdgeFunction: Parse workflow_definition

    loop Each workflow step
        EdgeFunction->>EdgeFunction: Execute step
        EdgeFunction->>Database: Log progress
    end

    EdgeFunction->>Database: UPDATE execution_count, success_rate
    EdgeFunction-->>Dashboard: Execution complete
    Dashboard-->>User: Show results
```

### Flowchart

```mermaid
flowchart TD
    A[User opens MEZAN] --> B[Load workflows]
    B --> C{Has workflows?}

    C -->|No| D[Show empty state]
    C -->|Yes| E[Display workflow cards]

    D --> F[Create first workflow]
    E --> G{User action?}

    G -->|Create| F
    G -->|Edit| H[Open workflow editor]
    G -->|Execute| I[Start execution]
    G -->|Delete| J[Confirm deletion]

    F --> K[Enter workflow name]
    K --> L[Define workflow steps]
    L --> M[Save workflow]
    M --> E

    H --> N[Modify definition]
    N --> O[Save changes]
    O --> E

    I --> P[Validate workflow]
    P --> Q{Valid?}
    Q -->|No| R[Show validation errors]
    Q -->|Yes| S[Execute steps]

    S --> T{All steps complete?}
    T -->|Error| U[Mark failed, log error]
    T -->|Success| V[Update success rate]

    U --> W[Show error summary]
    V --> X[Show execution summary]

    J --> Y{Confirmed?}
    Y -->|No| E
    Y -->|Yes| Z[Delete workflow]
    Z --> E
```

---

## AI Experiment (TalAI)

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant HyperparamControls
    participant useExperiments
    participant EdgeFunction
    participant Database

    User->>Dashboard: Create new experiment
    Dashboard->>HyperparamControls: Configure hyperparameters

    User->>HyperparamControls: Set learning_rate, epochs, etc.
    HyperparamControls->>useExperiments: createExperiment(config)
    useExperiments->>EdgeFunction: POST /talai-api
    EdgeFunction->>Database: INSERT talai_experiments
    Database-->>EdgeFunction: Experiment record

    User->>Dashboard: Start training
    Dashboard->>EdgeFunction: POST /talai-api (train)
    EdgeFunction->>EdgeFunction: Initialize model

    loop Training epochs
        EdgeFunction->>EdgeFunction: Train batch
        EdgeFunction->>Database: UPDATE progress, metrics
        Database-->>Dashboard: Realtime metrics
        Dashboard-->>User: Update training chart
    end

    EdgeFunction->>Database: UPDATE completed_at, final_metrics
    EdgeFunction-->>Dashboard: Training complete
    Dashboard-->>User: Show final results
```

### Flowchart

```mermaid
flowchart TD
    A[User opens TalAI] --> B[Load experiments]
    B --> C[Display experiment list]

    C --> D{User action?}
    D -->|New| E[Create experiment form]
    D -->|View| F[Open experiment details]
    D -->|Train| G[Start training]
    D -->|Compare| H[Open comparison view]

    E --> I[Enter experiment name]
    I --> J[Select model type]
    J --> K[Configure hyperparameters]
    K --> L[Save experiment]
    L --> C

    G --> M{Already trained?}
    M -->|Yes| N[Confirm retrain?]
    M -->|No| O[Begin training]
    N -->|Yes| O
    N -->|No| C

    O --> P[Training loop]
    P --> Q[Update metrics each epoch]
    Q --> R{Training complete?}
    R -->|No| P
    R -->|Yes| S[Save final metrics]
    S --> C

    H --> T[Select experiments]
    T --> U[Generate comparison charts]
    U --> V[Display side-by-side]
```

---

## Optimization Run (OptiLibria)

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant ParamControls
    participant useOptimizationRuns
    participant EdgeFunction
    participant Database

    User->>Dashboard: New optimization run
    Dashboard->>ParamControls: Show parameter form

    User->>ParamControls: Configure algorithm, problem
    ParamControls->>useOptimizationRuns: createRun(config)
    useOptimizationRuns->>EdgeFunction: POST /optilibria-api
    EdgeFunction->>Database: INSERT optilibria_runs
    Database-->>EdgeFunction: Run record

    User->>Dashboard: Start optimization
    Dashboard->>EdgeFunction: POST /optilibria-api (start)
    EdgeFunction->>EdgeFunction: Initialize algorithm

    loop Optimization iterations
        EdgeFunction->>EdgeFunction: Evaluate candidates
        EdgeFunction->>EdgeFunction: Update best solution
        EdgeFunction->>Database: UPDATE iterations, best_score
        Database-->>Dashboard: Progress update
        Dashboard-->>User: Update convergence chart
    end

    EdgeFunction->>Database: UPDATE results, completed_at
    EdgeFunction-->>Dashboard: Optimization complete
    Dashboard-->>User: Show Pareto front / best solution
```

---

## Quantum Experiment (QMLab)

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant WaveDisplay
    participant ParticleViz
    participant useQMExperiments
    participant EdgeFunction
    participant Database

    User->>Dashboard: Create quantum experiment
    Dashboard->>useQMExperiments: createExperiment(config)
    useQMExperiments->>EdgeFunction: POST /qmlab-api
    EdgeFunction->>Database: INSERT qmlab_experiments
    Database-->>EdgeFunction: Experiment record

    User->>Dashboard: Run simulation
    Dashboard->>EdgeFunction: POST /qmlab-api (simulate)
    EdgeFunction->>EdgeFunction: Initialize quantum system
    EdgeFunction->>EdgeFunction: Compute wave function
    EdgeFunction->>Database: UPDATE wave_function_data

    Database-->>Dashboard: Wave function data
    Dashboard->>WaveDisplay: Render wave function
    Dashboard->>ParticleViz: Animate particles

    User->>Dashboard: Perform measurement
    Dashboard->>EdgeFunction: POST /qmlab-api (measure)
    EdgeFunction->>EdgeFunction: Collapse wave function
    EdgeFunction->>Database: UPDATE measurement_results

    Database-->>Dashboard: Measurement data
    Dashboard-->>User: Show collapsed state
```

---

## Common Patterns

### Error Handling Flow

```mermaid
flowchart TD
    A[API Request] --> B{Success?}
    B -->|Yes| C[Update UI]
    B -->|No| D{Error type?}

    D -->|Auth| E[Redirect to login]
    D -->|Validation| F[Show field errors]
    D -->|Network| G[Show retry option]
    D -->|Server| H[Show error toast]

    E --> I[Clear session]
    F --> J[Highlight invalid fields]
    G --> K[Retry button]
    H --> L[Log error details]

    K --> A
```

### Data Sync Pattern

```mermaid
flowchart TD
    A[Component mounts] --> B[TanStack Query fetch]
    B --> C{Cache valid?}

    C -->|Yes| D[Return cached data]
    C -->|No| E[Fetch from API]

    D --> F[Render component]
    E --> G{Success?}

    G -->|Yes| H[Update cache]
    G -->|No| I[Show error state]

    H --> F

    J[User mutation] --> K[Optimistic update]
    K --> L[API request]
    L --> M{Success?}

    M -->|Yes| N[Invalidate queries]
    M -->|No| O[Rollback optimistic]

    N --> B
    O --> P[Show error]
```

---

## Related Documentation

- [Architecture](./ARCHITECTURE.md) - System design
- [Routing](./ROUTING.md) - API endpoints
- [ERD](./ERD.md) - Database schema
- [Modules](./MODULES.md) - Code organization
