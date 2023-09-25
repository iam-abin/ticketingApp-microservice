// __mock__ folder is userd for testing using jest
// when we are executing test using jest ,we dont need to use the real NATS or we dont need to use the
// code inside 'nats-wrpper.ts' file
// thats's why we are creating this fake file

// fake object for natsWrapper
export const natsWrapper = {
	client: {
		publish:jest.fn().mockImplementation((subject: string, data: string, callback: ()=> void)=>{
			callback();
		})
	},
};
