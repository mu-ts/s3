import { setConfiguration, setBucket, getObject } from './index';

setConfiguration({region: 'us-east-1'});
setBucket('development.us-east-1.messaging-addresses');

const go = async () => {
  const { Body } = await getObject({Key: '+12012010553'});
  console.log('Body', { Body });
}

go();