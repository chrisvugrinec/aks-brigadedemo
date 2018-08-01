# aks-brigadedemo

Microsoft is dedicated to contribute to the opensource community, for Kubernetes development we provide a holy trinity: Helm, Draft and Brigade. Originally conceived by the people from Deis it is now part of the Kubernetes dev eco system.

Brigade makes your Kubernetes cluster suitable for Events and Job Scheduling via a framework that makes it easy to script and pipeline certain tasks. Hereby Brigade utilizes the out of the box features from Kubernetes like Secrets, Events and Jobs in combination with an API based on Javascript.

Documentation is available here: https://github.com/Azure/brigade
I have used the gateway with this as template: http://technosophos.com/2018/04/23/building-brigade-gateways-the-easy-way.html

In order to run this demo you should have the following:
- A configured AKS cluster
- A client which has the following CLI: azure-cli, kubectl and brig cli; for brig cli visit: https://github.com/Azure/brigade/tree/master/brig
- A service principal
- A configured ACI plugin, instructions are in the aci-connector folder

Brigade scripts are triggered with an Event that can come from an entrypoint...this entrypoint is refered to as a gateway. In this demo we have a gateway that is exposed as a rest service. Once this webhook is called the following actions will be triggered:
- the webhook will refer to an existing project, this project is available in Kubernetes as a Secret of  type: brigade.sh/project
- this project will define the runtime in where the job will execute
- a new build will be created, based on the project data...the project is configured that it will get the script (brigade.js) from a github repository.
- the script uses environment variables that are declared in the runtime project, so they are in the secret of the brigade.sh/project
- the build will create a new kubernetes secret of type: brigade.sh/build
- the brigade.js script in this demo defines 1 or more jobs which consists of 1 or more tasks...these jobs are run in a certain order that is defined in the brigade.js
- for every job a new secret is created of type:  brigade.sh/job 
- the jobs are using a docker image from my dockerhub, which contains all you need to communicate with AKS.
- the environment variables used in this job are configured in the project secret
- the job with the event name DEPLOY will deploy 1 busybox instance
- the job with the event name SCALE will scale the busybox instance an X amount of times...In this demo actual nodes are being spun up, these nodes are Azure Container Instances, I will demonstrate that by typing az container list -o table, after and before the scale event. 
