### solution for a possible error,

===											=============	Error  =============

 - deployment/admin-depl: Failed to create Pod for Deployment admin-depl: Error creating: Unauthorized
 - deployment/admin-depl failed. Error: Failed to create Pod for Deployment admin-depl: Error creating: Unauthorized.
 - deployment/auth-depl: Failed to create Pod for Deployment auth-depl: Error creating: Unauthorized
 - deployment/auth-depl failed. Error: Failed to create Pod for Deployment auth-depl: Error creating: Unauthorized.
Cleaning up...
 - deployment.apps "admin-depl" deleted
 - service "admin-srv" deleted
 - deployment.apps "auth-depl" deleted
 - service "auth-srv" deleted
 - deployment.apps "client-app-depls" deleted
 - service "client-app-srvs" deleted
 - deployment.apps "job-depl" deleted
 - service "job-srv" deleted
 - deployment.apps "profile-depl" deleted
 - service "profile-srv" deleted
1/5 deployment(s) failed

=== 									=============	to solve this Error  =============

- removes all stopped containers, all networks not used by at least one container, all volumes not used by at least one container, and all images without at least one container associated with them,

	```
	docker system prune -a --volumes
	```

- delete all deployments, services and pods in the defauld namespace,

	```
	kubectl delete deployments --all
	kubectl delete services --all
	kubectl delete pods --all
	```

- delete all deployments, services and pods in the ingress-nginx namespace
	
1. to see other namespaces

	```
	kubectl get namespaces
	```

2. ```
	kubectl delete deployments --all -n ingress-nginx 
	kubectl delete services --all -n ingress-nginx 
	kubectl delete pods -n ingress-nginx 
	```
3. check the are deleted
	```
	kubectl get pods -n ingress-nginx
	```

- now,
 apply yaml files,
	```
 	cd k8s/stateful
	kubectl apply -f .
	``` 
	
 	```
 	cd k8s/stateless
	kubectl apply -f .
 	``` 
- applying ingress-service.yaml file show some warning an do not apply so,
	instead of applying ingress-service.yaml do,
	so,
	to enable and configure the NGINX Ingress Controller,

	```
	minikube addons enable ingress
	```
- in root directory,
```
skaffold dev
```
=======maybe will show deployment failed again so, 

1. delete specifying images from docker hub(here admin's image and auth's image),
2. build a new image of them again,
 	```
 	cd admin/
 	docker build -t abinv/admin
 	```
 	
 	```
 	cd auth/
 	docker build -t abinv/auth
 	``` 
 
 
3. push to these images to docker hub,
```
docker push abinv/admin
```

```
docker push abinv/auth
```

4. in root directory,

```
skaffold dev
```