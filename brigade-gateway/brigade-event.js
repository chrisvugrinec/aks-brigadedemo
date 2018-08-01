
const k8s = require("@kubernetes/client-node");
const {Buffer} = require("buffer");
const ulid = require("ulid");

const kube = k8s.Config.defaultClient();

exports.Event = function(ns) {
    this.namespace = ns;
    this.commit_id = "";
    this.commit_ref = "refs/heads/master";
    //this.event_provider = "brigade-gw-pack";
    this.event_provider = "brigade";
    this.script = "";
    this.log_level = "";

    this.build_id = "";

    /**
     * Create this event inside of Kubernetes.
     *
     * @param string hook
     *   The event name (e.g. exec)
     * @param string project
     *   The project ID, of the form 'brigade-XXXXXXXX...'
     * @param string payload
     *   The payload that should be sent. Empty is okay.
     */
    this.create = function(hook, project, payload) {
        // This is a guard to prevent us from creating
        // an event for a project that does not exist.
        return kube.readNamespacedSecret(project, this.namespace).then( () => {

            if (!this.build_id) {
              this.build_id = ulid.ulid().toLowerCase()
            }
            let buildName = `brigade-${this.build_id}`
            let secret = new k8s.V1Secret()
            secret.type = "brigade.sh/build"
            secret.metadata = {
                name: buildName,
                labels: {
                    component: "build",
                    heritage: "brigade",
                    build: this.build_id,
                    project: project
                }
            }

            secret.data = {
                // TODO: Do we let this info be passed in?
                commit_id: b64enc(this.commit_id),
                commit_ref: b64enc(this.commit_ref),
                build_id: b64enc(this.build_id),
                build_name: b64enc(buildName),
                event_provider: b64enc(this.event_provider),
                event_type: b64enc(hook),
                project_id: b64enc(project),
                payload: b64enc(payload)
            }
            if (this.script) {
                secret.data.script = b64enc(this.script);
            }
            if (this.log_level) {
                //secret.data.log_level = base64enc(this.script);
            }
            return kube.createNamespacedSecret(this.namespace, secret);
        }).catch(() => {
            return Promise.reject(`project ${project} could not be loaded`);
        })
    }
}

const encode = require('nodejs-base64-encode');

function b64enc(original) { 
    if(original === null || original === "" ){
      result = original;
    }else{
      console.log("ori: "+String(original)+" encoded: "+result);
      result = encode.encode(String(original), 'base64');
    }
    return result;

    //return Buffer.from(original).toString("base64");
}
