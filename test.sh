#!/bin/bash

# Visual Bio Test Runner

set -e

echo "🧪 Visual Bio Test Suite"
echo "========================"

# Function to run frontend tests
run_frontend_tests() {
    echo "📱 Running Frontend Tests..."
    cd frontend
    
    if [ "$1" == "coverage" ]; then
        pnpm test:coverage
    else
        pnpm test --watchAll=false
    fi
    
    echo "✅ Frontend tests completed!"
    cd ..
}

# Function to run backend tests
run_backend_tests() {
    echo "🔧 Running Backend Tests..."
    cd backend
    
    if [ "$1" == "coverage" ]; then
        source .venv/bin/activate && pytest --cov=main --cov-report=html --cov-report=term-missing
    else
        source .venv/bin/activate && pytest -v
    fi
    
    echo "✅ Backend tests completed!"
    cd ..
}

# Function to run all tests
run_all_tests() {
    echo "🚀 Running All Tests..."
    run_frontend_tests $1
    run_backend_tests $1
    echo "🎉 All tests completed!"
}

# Parse command line arguments
case "$1" in
    "frontend"|"fe")
        run_frontend_tests $2
        ;;
    "backend"|"be")
        run_backend_tests $2
        ;;
    "all"|"")
        run_all_tests $2
        ;;
    "coverage"|"cov")
        run_all_tests "coverage"
        ;;
    *)
        echo "Usage: $0 [frontend|backend|all|coverage] [--watch]"
        echo "  frontend, fe  - Run frontend tests only"
        echo "  backend, be   - Run backend tests only"
        echo "  all, (empty)  - Run all tests (default)"
        echo "  coverage, cov - Run tests with coverage reports"
        exit 1
        ;;
esac