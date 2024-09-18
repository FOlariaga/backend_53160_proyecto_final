import config from '../config.js';

let factoryProductService = {};

switch (config.PERSISTENCE) {
    case 'mongo':
        console.log('Persistencia a MONGODB');
        const { default: MongoSingleton } = await import('./mongo.singleton.js');
        await MongoSingleton.getInstance();
        
        const MongoService = await import('../dao/productsManager.js');
        factoryProductService = MongoService.default;
        break;
        
    default:
        throw new Error(`Persistencia ${config.PERSISTENCE} no soportada`);
}

export default factoryProductService;