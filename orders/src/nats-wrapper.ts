import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
	// client should be undefiend untill we call connect() from index.ts file
	private _client?: Stan; // '?', it means that you can either provide a value for that property or leave it undefined

	// this getter method throw error if someone access '_client' before initializing
	get client() {
		if (!this._client) {
			throw new Error("Cannot access NATS before connecting!");
		}
		return this._client;
	}

	// this connect() is called from index.ts
	connect(clusterId: string, clientId: string, url: string) {
		this._client = nats.connect(clusterId, clientId, { url }); // clusterId is 'ticketing' getting from -cid in infra/k8s/nats-depl.yaml

		return new Promise<void>((resolve, reject) => {
			this.client.on("connect", () => {
				console.log("Connected to NATS");
				resolve();
			});

			this.client.on("error", (err) => {
				console.log(`Error when cconnecting to nats ${err}`);
				
				reject(err);
			});
		});
	}
}

export const natsWrapper = new NatsWrapper(); // this one instance can be accessed form multiple file
