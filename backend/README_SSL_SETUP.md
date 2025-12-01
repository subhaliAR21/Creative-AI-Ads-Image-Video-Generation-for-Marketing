# SSL Certificate Setup for Backend HTTPS Server

To enable HTTPS for the backend server, you need to generate self-signed SSL certificates.

## Steps to generate self-signed certificates using OpenSSL

1. Open a terminal and navigate to the `backend` directory.

2. Create a directory named `certs` to store the certificate files:
   ```
   mkdir certs
   cd certs
   ```

3. Generate a private key:
   ```
   openssl genrsa -out key.pem 2048
   ```

4. Generate a certificate signing request (CSR):
   ```
   openssl req -new -key key.pem -out csr.pem
   ```
   - You will be prompted to enter information such as country, state, organization, etc.
   - For development, you can enter dummy values or leave blank.

5. Generate the self-signed certificate:
   ```
   openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
   ```

6. You should now have `key.pem` and `cert.pem` files inside the `certs` directory.

7. Restart backend server to use the new certificates.

## Notes

- Browsers will warn about self-signed certificates since they are not from a trusted authority. This is expected in development.
- For production, use certificates from a trusted CA like Let's Encrypt.

---

