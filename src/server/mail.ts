import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const makeANiceEmail = (text: string[]) => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello!</h2>
    ${text
      .map(line => {
        return `<p>${line}<p>`;
      })
      .join('')}
    <p>🧀, Andrew</p>
  </div>
`;
