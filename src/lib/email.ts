import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(email: string, resetUrl: string) {
  const { data, error } = await resend.emails.send({
    from: "Boo Space <support@boospace.tech>",
    to: email,
    subject: "Đặt lại mật khẩu Boospace",
    html: `
      <h2>Boo Space Password Reset</h2>

      <p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>

      <p>
        <a href="${resetUrl}">
          Đặt lại mật khẩu
        </a>
      </p>

      <p>Link sẽ hết hạn sau 1 giờ.</p>
    `,
  });

  console.log("RESEND DATA:", data);
  console.log("RESEND ERROR:", error);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
