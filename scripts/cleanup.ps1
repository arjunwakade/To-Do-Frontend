# Cleanup script
param (
    [string]$namespace = "todo-app"
)

Write-Host "🧹 Starting cleanup for Todo App..."

# Delete all resources in the namespace
kubectl delete namespace $namespace

Write-Host "✅ Cleanup completed successfully!"