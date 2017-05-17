npm install --prefix server
(npm install --prefix client && npm run build --prefix client) &
cp server/config/config-production.js server/config/config.js
npm run start
