#!/bin/bash

# 🚀 Deployment Script for Dairy Farm Management System
# This script helps you deploy to different environments

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to check if we're in the right directory
check_directory() {
    if [ ! -f "package.json" ]; then
        print_error "Not in project root directory!"
        exit 1
    fi
    print_success "Directory check passed"
}

# Function to check git status
check_git_status() {
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "You have uncommitted changes!"
        read -p "Do you want to continue? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    print_success "Git status check passed"
}

# Function to run tests
run_tests() {
    print_info "Running tests..."
    
    print_info "Type checking..."
    pnpm typecheck || {
        print_error "Type check failed!"
        exit 1
    }
    
    print_info "Linting..."
    pnpm lint || {
        print_error "Lint check failed!"
        exit 1
    }
    
    print_info "Building..."
    pnpm build || {
        print_error "Build failed!"
        exit 1
    }
    
    print_success "All tests passed!"
}

# Function to deploy to development
deploy_dev() {
    print_info "Deploying to DEVELOPMENT..."
    
    git checkout develop
    git pull origin develop
    
    run_tests
    
    git push origin develop
    
    print_success "Deployed to development!"
    print_info "Check your Railway and Vercel dashboards for deployment status"
}

# Function to deploy to staging
deploy_staging() {
    print_info "Deploying to STAGING..."
    
    git checkout staging
    git pull origin staging
    git merge develop
    
    run_tests
    
    git push origin staging
    
    print_success "Deployed to staging!"
    print_warning "Please test thoroughly on staging before deploying to production!"
}

# Function to deploy to production
deploy_production() {
    print_warning "⚠️  PRODUCTION DEPLOYMENT ⚠️"
    print_warning "This will deploy to production!"
    read -p "Are you sure? (yes/no) " -r
    echo
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_info "Deployment cancelled"
        exit 0
    fi
    
    print_info "Deploying to PRODUCTION..."
    
    git checkout main
    git pull origin main
    git merge staging
    
    run_tests
    
    # Create a tag for this release
    VERSION=$(date +%Y%m%d-%H%M%S)
    git tag -a "v$VERSION" -m "Production release $VERSION"
    
    git push origin main
    git push origin "v$VERSION"
    
    print_success "Deployed to production!"
    print_success "Version: v$VERSION"
}

# Function to show current status
show_status() {
    print_info "Current Git Status:"
    echo "---"
    git status
    echo "---"
    print_info "Current Branch: $(git branch --show-current)"
    print_info "Latest Commits:"
    git log --oneline -5
}

# Main menu
main() {
    clear
    echo "╔════════════════════════════════════════╗"
    echo "║  🐄 Dairy Farm Deployment Script 🐄   ║"
    echo "╚════════════════════════════════════════╝"
    echo ""
    
    check_directory
    
    echo "Select deployment environment:"
    echo "1) Development (develop branch)"
    echo "2) Staging (staging branch)"
    echo "3) Production (main branch)"
    echo "4) Show current status"
    echo "5) Run tests only"
    echo "6) Exit"
    echo ""
    read -p "Enter your choice [1-6]: " choice
    
    case $choice in
        1)
            check_git_status
            deploy_dev
            ;;
        2)
            check_git_status
            deploy_staging
            ;;
        3)
            check_git_status
            deploy_production
            ;;
        4)
            show_status
            ;;
        5)
            run_tests
            ;;
        6)
            print_info "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice!"
            exit 1
            ;;
    esac
}

# Run main function
main
