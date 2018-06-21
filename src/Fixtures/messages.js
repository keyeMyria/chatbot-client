module.exports = [
  {
    id: Math.round(Math.random() * 1000000),
    text: 'Yes, and I use Doppio Chat!',
    createdAt: new Date(Date.UTC(2017, 7, 30, 17, 20, 0)),
    isUser: false,
    /*
    user: {
      id: 1,
      avatar:'https://randomuser.me/api/portraits/thumb/women/78.jpg',
      name: 'A User',
    },*/
    sent: true,
    received: true,
    // location: {
    //   latitude: 48.864601,
    //   longitude: 2.398704
    // },
  },
  {
    id: Math.round(Math.random() * 1000000),
    text: 'Are you building a chat app?',
    createdAt: new Date(Date.UTC(2017, 7, 30, 17, 20, 0)),
    isUser: true,
    /*
    user: {
      id: 2,
      avatar:'https://randomuser.me/api/portraits/thumb/men/28.jpg',      
      name: 'React Native',
    },*/
  },
];
