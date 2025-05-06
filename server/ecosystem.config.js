module.exports = {
    apps: [
      {
        name: "Taskilo",
        script: "npm",
        args: "run dev",
        env: {
          NODE_ENV: "development",
        },
      },
    ],
  };