const fs = require('fs')
const path = require('path')

const { STATUS_CODES } = require('http')

const pageTemplate = fs.readFileSync(
  './template.html',
  'utf8'
)

const errors = Object.keys(STATUS_CODES)
  .filter(error => error > 399)

errors
  .forEach((code) => {
    fs.writeFileSync(
      path.join(__dirname, 'terrors', `${code}.html`),
      pageTemplate.replace(/~ message ~/g, STATUS_CODES[code])
    )
  })

const errorLocation = `
location ^~ /terrors/ {
  internal;
  root /var/www;
}
`

let nginx = errors.map(
  code => `error_page ${code} /terrors/${code}.html;`
)

nginx
  .push(errorLocation)

fs.writeFileSync(
  path.join(__dirname, 'terrors.conf'),
  nginx.join('\n')
)

console.log(`Next:
- relocate ./terrors/ to be /var/www/terrors
- relocate terrors.conf to be /etc/nginx/snippets/terrors.conf
- include the snippet in nginx config
`)