const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const ethers = require('ethers');
const PaymentProcessor = require('../frontend/src/contracts/PaymentProcessor.json');
const {Payment} = require('./db.js');

const app = new Koa();
const router = new Router();
//instead of hardcoding the following part it will be stored on a mongodb database
const items = {
	'1': {id: 1, url: 'http://UrlToDownLoadItem1'},
	'2': {id: 2, url: 'http://UrlToDownLoadItem2'},
};

router.get('/api/getPaymentId/:itemId', async ctx => {
	const paymentId = (Math.random() * 10000).toFixed(0);
	await Payment.create({
		id: paymentId,
		itemtId: ctx.params.itemId,
		paid: false
	});
	ctx.body = {
		paymentId
	};
});

router.get('/api/getItemUrl/:paymentId', async ctx => {
	const payment = await Payment.findOne({id: ctx.params.paymentId});
	if(payment && payment.paid === true) {
		//the next part in ctx.body where the url is returned, instead of 
		//this you would initiate the delivery process
		ctx.body = {
			url: items[payment.itemId].url
		}
	} else {
		//returning an empty url when payment is false
		ctx.body = {
			url: ''
		}
	}
});

router

app
	.use(cors())
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(4000, () => {
	console.log('Server running on port 4000');
})

const listenToEvents = () => {
	//to run code for public test network like kovan or for the main ethereum network
	//change the following url
	const provider = new ethers.providers.JsonRpcProvider('http://localhost:9545');
	//for ganache the networkid is 5777 for main ethereum network the networkid is 1
	//you can find the network for whatever purpose you need online like for the testnetwork
	//just google name of the network and network id

	const networkId = '5777';

	const paymentProcessor = new ethers.Contract(
		PaymentProcessor.networks[networkId].address,
		PaymentProcessor.abi,
		provider
	);

	paymentPRocessor.on('PaymentDone', async (payer, amount, paymentId, data) => {
		console.log(`
			from ${payer}
			amount ${amount}
			paymentId ${paymentId}
			date ${(new Date(date.toNumber() * 1000)).toLocaleString()}
		`);
	const payment = await Payment.findOne({id: paymentId});
	if (payment) {
		payment.paid = true;
		await payment.save();
	}
	});
	
}
listenToEvents;