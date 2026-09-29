module.exports = {
  docs: [
    {
      type: 'category',
      label: 'About BuilderNet',
      collapsed: false,
      items: [
        'what-is-buildernet',
        'how-to-participate',
        'refunds',
        'roadmap',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      collapsed: false,
      items: [
        'os-services-builds',
        'operator-api',
        'flashbots-infra',
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsed: false,
      items: [
        'resources',
        'api',
        'send-orderflow',
        'public-identity',
        'network-ports',
        'open-source',
        {
          type: 'category',
          label: 'Operator Guides',
          // link: {
          //   type: 'doc',
          //   id: 'operator-guides',
          // },
          items: [
            'operating-a-node',
            'staging-instance-handbook',
            'downloads-measurements',
            'historic-measurements',
          ]
        }
        ,
        // 'contribute',
      ],
    },
  ],
};
