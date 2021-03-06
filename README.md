These are just notes for when I want to add to this and deploy, because I forget each time.

`yarn dev` is what you use to develop on.

The split of front and back-end means that when you want to develop and see front-end changes, you
need to add PORT=3000 to `start:client` in the `package.json`. For deployment, make sure it's `PORT=5000`