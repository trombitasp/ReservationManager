-include .env

.PHONY: $(MAKECMDGOALS)

build-all: build-manager build-auth-backend build-frontend build-proxy

deploy-all: build-all deploy-dbs deploy-services

delete-all: delete-services delete-dbs

# Build microservices
build-manager:
	cd ReservationManager && \
	./gradlew bootJar && \
	docker build \
		-f "Dockerfile-container" \
		-t manager-backend \
		--build-arg config=docker.yml \
		.

build-auth-backend:
	cd reservation-auth-backend && \
	./gradlew bootJar && \
	docker build \
		-f "Dockerfile-container" \
		-t reservation-auth-backend \
		--build-arg config=docker.yml \
		.

build-frontend:
	cd reservation-manager-frontend && \
	npm run build && \
	docker build \
		-f "Dockerfile-container" \
		-t reservation-manager-frontend \
		.

build-proxy:
	cd reservation-manager-reverse-proxy && \
	docker build \
		-t reservation-manager-proxy \
		.

deploy-dbs:
	kubectl apply -f k8s/mysql-deployment.yaml

deploy-services:
	kubectl apply -f k8s/manager-backend-deployment.yaml
	kubectl apply -f k8s/auth-backend-deployment.yaml
	kubectl apply -f k8s/frontend-deployment.yaml
	kubectl apply -f k8s/proxy-deployment.yaml

delete-services:
	kubectl delete -f k8s/manager-backend-deployment.yaml || true
	kubectl delete -f k8s/auth-backend-deployment.yaml || true
	kubectl delete -f k8s/frontend-deployment.yaml || true
	kubectl delete -f k8s/proxy-deployment.yaml || true

delete-dbs:
	kubectl delete -f k8s/mysql-deployment.yaml || true