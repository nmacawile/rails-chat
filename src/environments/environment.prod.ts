import { domainProd } from './domain';

export const environment = {
  production: true,
  domain: domainProd,  
  url: `https://${domainProd}`,
  cableUrl: `wss://${domainProd}/cable`,
};
