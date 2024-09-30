// const networkInterfaces = os.networkInterfaces();
// export const ip = networkInterfaces["   "][0]["address"];
// export const portNo = "8082";
// console.log(networkInterfaces);

export const getCurrentIpaddress = () => {
  // console.log(os);
  // const nets = os.networkInterfaces();
  // console.log(nets);
  // const results = Object.create(null); // Or just '{}', an empty object
  // for (const name of Object.keys(nets)) {
  //   for (const net of nets[name]) {
  //     // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
  //     if (net.family === "IPv4" && !net.internal) {
  //       if (!results[name]) {
  //         results[name] = [];
  //       }
  //       results[name].push(net.address);
  //     }
  //   }
  // }
  // // console.log("results", results);
  // let finalIpdlist = results[Object.keys(results)[0]];
  // console.log("finalIpd", finalIpdlist[0]);
  // return "192.168.1.5"; // local dev
  // return "194.233.89.164"; // CONTABO SERVER
  // return finalIpdlist ? finalIpdlist[0] : "localhost";
  // return "192.168.1.210"; // SUYASH SERVER IP
  // return "192.168.1.21"; // SANTOSH SERVER IP
  return "localhost";
  // return "192.168.1.210";
};

export const getPortNo = () => {
  return 3076;
  // return 3074;
  // return 3077;

  // suyash client data port
  // return 3072;
  // return 3076;      /* suyash vidyalay live-online  */
  // return 3075;           /* suyash gurukul mannual client-online  */
};
