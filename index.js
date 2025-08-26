/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 * ! If you do not download the source code from the above address, you are using an unknown version and at risk of having your account hacked
 *
 * English:
 * ! Please do not change the below code, it is very important for the project.
 * It is my motivation to maintain and develop the project for free.
 * ! If you change it, you will be banned forever
 * Thank you for using
 *
 * Vietnamese:
 * ! Vui lòng không thay đổi mã bên dưới, nó rất quan trọng đối với dự án.
 * Nó là động lực để tôi duy trì và phát triển dự án miễn phí.
 * ! Nếu thay đổi nó, bạn sẽ bị cấm vĩnh viễn
 * Cảm ơn bạn đã sử dụng
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");

function startProject() {
	const child = spawn("node", ["Goat.js"], {
		cwd: __dirname,
		stdio: "inherit",
		shell: true
	});

	child.on("close", (code) => {
		if (code == 2) {
			log.info("Restarting Project...");
			// Send restart notification if possible
			if (global.GoatBot && global.client && global.client.api) {
				setTimeout(async () => {
					try {
						const api = global.client.api;
						const owners = global.GoatBot.config?.owner || [];
						const adminBot = global.GoatBot.config?.adminBot || [];
						const notificationThreadIds = global.GoatBot.config?.notificationThreadIds || [];
						const allRecipients = [...new Set([...owners, ...adminBot])];
						
						const restartTime = new Date().toLocaleString('en-US', {
							timeZone: 'Asia/Dhaka',
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit',
							hour12: true
						});

						const botName = global.GoatBot.config?.nickNameBot || "GoatBotV2";
						const restartMessage = `${botName} Restart Notification\n\n` +
							`Bot is restarting...\n` +
							`Restart time: ${restartTime}\n` +
							`Reason: Automatic restart (code 2)\n\n` +
							`Bot will be back online shortly!`;

						// Send to individual recipients
						for (const recipientId of allRecipients) {
							if (recipientId && !isNaN(recipientId)) {
								try {
									await api.sendMessage(restartMessage, recipientId);
									await new Promise(resolve => setTimeout(resolve, 500));
								} catch (error) {
									console.log(`Failed to send restart notification to ${recipientId}:`, error.message || error);
								}
							}
						}

						// Send to notification threads
						for (const threadId of notificationThreadIds) {
							if (threadId && !isNaN(threadId)) {
								try {
									await api.sendMessage(restartMessage, threadId);
									await new Promise(resolve => setTimeout(resolve, 500));
								} catch (error) {
									console.log(`Failed to send restart notification to thread ${threadId}:`, error.message || error);
								}
							}
						}

						console.log("Restart notifications sent, restarting bot...");
					} catch (error) {
						console.log("Error sending restart notifications:", error.message || error);
					}
					
					// Start the project after sending notifications
					setTimeout(startProject, 2000);
				}, 1000);
			} else {
				startProject();
			}
		}
	});
}

console.log('Starting GoatBotV2...');
startProject();

console.log('started successfully');
