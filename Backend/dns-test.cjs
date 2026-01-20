const dns = require('dns');
dns.setServers(['8.8.8.8']);

console.log('Resolving SRV record for: _mongodb._tcp.cluster0.lc2qwz1.mongodb.net (using 8.8.8.8)');

dns.resolveSrv('_mongodb._tcp.cluster0.lc2qwz1.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('❌ DNS Resolve Error:', err);
    return;
  }
  console.log('✅ Successfully resolved addresses:', addresses);
  
  addresses.forEach(addr => {
    dns.lookup(addr.name, (err, address) => {
      if (err) {
        console.error(`❌ Lookup Error for ${addr.name}:`, err);
      } else {
        console.log(`✅ ${addr.name} resolved to ${address}`);
      }
    });
  });
});
