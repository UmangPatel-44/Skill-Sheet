using System;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Threading.Tasks;
using DataAccess.Entities;
using Microsoft.Extensions.Configuration;

namespace SkillSheet.Services.Implementation
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendPasswordChangeEmailAsync(string email, string newPassword)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("SmtpSettings");
                var host = smtpSettings["Host"];
                int port = int.Parse(smtpSettings["Port"]!);
                string username = smtpSettings["Username"]!;
                string password = smtpSettings["Password"]!;
                bool enableSsl = bool.Parse(smtpSettings["EnableSsl"]!);

                // Mask the new password
                string maskedPassword = new string('*', newPassword.Length - 2) + newPassword[^2..];

                using (var smtpClient = new SmtpClient(host, port))
                {
                    smtpClient.Credentials = new NetworkCredential(username, password);
                    smtpClient.EnableSsl = enableSsl;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(username, "Skill Sheet Support"),
                        Subject = "🔐 Password Changed Successfully",
                        Body = $@"<html>
                                <body style='font-family: Arial, sans-serif; padding: 20px;'>
                                    <h2 style='color: #2E86C1;'>Password Change Confirmation</h2>
                                    <p>Hello,</p>
                                    <p>We wanted to inform you that your password has been successfully changed.</p>
                                    <p><strong>New Password:</strong> <span style='background-color: #f4f4f4; padding: 5px; border-radius: 5px;'>{maskedPassword}</span></p>
                                    <p>If you did not make this change, please contact our support team immediately.</p>
                                    <br>
                                    <p style='color: #888;'>Best Regards,</p>
                                    <p style='color: #2E86C1;'><strong>Skill Sheet Manager</strong></p>
                                </body>
                              </html>",
                        IsBodyHtml = true,
                    };
                    mailMessage.To.Add(email);
                    await smtpClient.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email sending failed: {ex.Message}");
            }
        }
        public async Task SendAdminChangeNotificationAsync(string email, string newUsername, string newPassword,bool isPasswordSame)
        {
            try
            {

                var smtpSettings = _configuration.GetSection("SmtpSettings");
                var host = smtpSettings["Host"];
                int port = int.Parse(smtpSettings["Port"]!);
                string username = smtpSettings["Username"]!;
                string password = smtpSettings["Password"]!;
                bool enableSsl = bool.Parse(smtpSettings["EnableSsl"]!);
                if(isPasswordSame)
                { newPassword = "Previous Password Only, No Changes Done!!!!"; }

                using (var smtpClient = new SmtpClient(host, port))
                {
                    smtpClient.Credentials = new NetworkCredential(username, password);
                    smtpClient.EnableSsl = enableSsl;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(username, "Skill Sheet Support"),
                        Subject = "🔔 Account Information Updated",
                        Body = $@"<html>
                                <body style='font-family: Arial, sans-serif; padding: 20px;'>
                                    <h2 style='color: #2E86C1;'>Account Update Notification</h2>
                                    <p>Hello,</p>
                                    <p>Your account details have been updated by an administrator.</p>
                                    <p><strong>New Username:</strong> {newUsername}</p>
                                    <p><strong>New Password:</strong> <span style='background-color: #f4f4f4; padding: 5px; border-radius: 5px;'>{newPassword}</span></p>
                                    <p>If you did not request these changes, please contact support immediately.</p>
                                    <br>
                                    <p style='color: #888;'>Best Regards,</p>
                                    <p style='color: #2E86C1;'><strong>Skill Sheet Manager</strong></p>
                                </body>
                              </html>",
                        IsBodyHtml = true,
                    };
                    mailMessage.To.Add(email);
                    await smtpClient.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email sending failed: {ex.Message}");
            }
        }
        public async Task NewUserEmailAsync(string email,string newUsername,string newPassword)
        {
            var smtpSettings = _configuration.GetSection("SmtpSettings");
            var host = smtpSettings["Host"];
            int port = int.Parse(smtpSettings["Port"]!);
            string username = smtpSettings["Username"]!;
            string password = smtpSettings["Password"]!;
            bool enableSsl = bool.Parse(smtpSettings["EnableSsl"]!);
            using (var smtpClient = new SmtpClient(host, port))
            {
                smtpClient.Credentials = new NetworkCredential(username, password);
                smtpClient.EnableSsl = enableSsl;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(username, "Skill Sheet Support"),
                    Subject = "🎉 Welcome to The Company – Your Account Details",
                    Body = $@"<html>
                <body style='font-family: Arial, sans-serif; padding: 20px;'>
                    <h2 style='color: #2E86C1;'>Welcome to Your Company!</h2>
                    <p>Hello,</p>
                    <p>Your account has been successfully created. Here are your login details:</p>
                    <p><strong>Username:</strong> {newUsername}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Temporary Password:</strong> <span style='background-color: #f4f4f4; padding: 5px; border-radius: 5px;'>{newPassword}</span></p>
                    <p>Please log in and change your password as soon as possible.</p>
                    <p><a href='https://thinkbiz.com/login' style='display: inline-block; padding: 10px 15px; background-color: #2E86C1; color: white; text-decoration: none; border-radius: 5px;'>Login Now</a></p>
                    <p>If you did not request this account, please contact support immediately.</p>
                    <br>
                    <p style='color: #888;'>Best Regards,</p>
                    <p style='color: #2E86C1;'><strong>Your Company Support Team</strong></p>
                </body>
              </html>",
                    IsBodyHtml = true,
                };
                mailMessage.To.Add(email);
                await smtpClient.SendMailAsync(mailMessage);
            }
         
        }
        public async Task UserDeletedByAdminAsync(string email)
        {
            var smtpSettings = _configuration.GetSection("SmtpSettings");
            var host = smtpSettings["Host"];
            int port = int.Parse(smtpSettings["Port"]!);
            string username = smtpSettings["Username"]!;
            string password = smtpSettings["Password"]!;
            bool enableSsl = bool.Parse(smtpSettings["EnableSsl"]!);
            using (var smtpClient = new SmtpClient(host, port))
            {
                smtpClient.Credentials = new NetworkCredential(username, password);
                smtpClient.EnableSsl = enableSsl;   
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(username, "Skill Sheet Support"),
                    Subject = "⚠️ Account Deletion Notice",
                    Body = $@"<html>
                <body style='font-family: Arial, sans-serif; padding: 20px;'>
                    <h2 style='color: #C0392B;'>Account Deletion Notification</h2>
                    <p>Hello,</p>
                    <p>We would like to inform you that your account has been deleted by an administrator.</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p>If you believe this was done in error or if you have any concerns, please contact our support team as soon as possible.</p>
                    <p>You can reach out to us at <a href='mailto:skillsheet_support@example.com'>skillsheet_support@example.com</a>.</p>
                    <br>
                    <p style='color: #888;'>Best Regards,</p>
                    <p style='color: #C0392B;'><strong>Your Company Support Team</strong></p>
                </body>
              </html>",
                    IsBodyHtml = true,
                };
                mailMessage.To.Add(email);
                await smtpClient.SendMailAsync(mailMessage);
            }
        }
    }
}
