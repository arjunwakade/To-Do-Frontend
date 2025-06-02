# Deploy script
param (
    [string]$namespace = "todo-app"
)

Write-Host "🚀 Starting deployment for Todo App..."

# Create namespace if it doesn't exist
kubectl create namespace $namespace --dry-run=client -o yaml | kubectl apply -f -

# Apply Backend
Write-Host "📦 Deploying backend..."
kubectl apply -f ../To-Do-Backend/kubernetes/ -n $namespace

# Apply Frontend
Write-Host "🖥️ Deploying frontend..."
kubectl apply -f ../To-Do-Frontend/kubernetes/ -n $namespace

# Wait for deployments
Write-Host "⌛ Waiting for deployments to be ready..."
kubectl rollout status deployment/todo-backend -n $namespace
kubectl rollout status deployment/todo-frontend -n $namespace

Write-Host "✅ Deployment completed successfully!"