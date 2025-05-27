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
        'architecture',
        'os-services-builds',
        'operator-api',
        'flashbots-infra',
      ],
    },
    {
      type: 'category',
      label: 'Security',
      collapsed: false,
      items: [
        'verifiable-system-integrity',
        'encryption-attestations',
        'orderflow-sharing-confidentiality',
        // 'threat-model',
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsed: false,
      items: [
        'api',
        'send-orderflow',
        'public-identity',
        'network-ports',
        'downloads-measurements',
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
          ]
        }
        ,
        // 'contribute',
      ],
    },
  ],
};
