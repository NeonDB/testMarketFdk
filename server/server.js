const { tickets } = require('./tickets');
const { base64encode } = require('nodejs-base64');
exports = {
  onAppInstallHandler: function (args) {
    /**
     * Init some params and special data like API's keys and so on;
     */
    const { Bot } = require('grammy');
    const botToken = args.iparams.TelegrammAPI;
    console.log(botToken)
    try {
      const bot = new Bot(botToken, {
        client: {
          canUseWebhookReply: (method) => method === "sendChatAction",
        },
      });
      console.log('Created bot');
      console.log('Creating webhook');
      generateTargetUrl()
        .then((url) => {
          console.log("Got url: ", url);
          try {
            bot.api.setWebhook(url);
            console.log("Webhook set up: " + bot.api.getWebhookInfo)
          } catch (error) {
            console.log("Got error while setting webhook, keep working");
            renderData({ message: "Error while setting up webhook", error });
          }
        })
    } catch (e) {
      console.log(e);
    }
    renderData();
  },

  onAppUninstallHandler: function (payload) {
    console.info("This is payload: ", payload)
    const { Bot } = require('grammy');
    const botToken = payload.iparams.TelegrammAPI;
    try {
      console.log("create bot")
      const bot = new Bot(botToken, {
        client: {
          canUseWebhookReply: (method) => method === "sendChatAction",
        },
      });
      console.log("try to delete webhook");
      bot.api.deleteWebhook(true);
      console.log("webhook from telegram deleted");
    } catch (e) {
      console.log(e)
    }
    renderData();
  },

  onExternalEventHandler: function (data) {
    const apibase64 = base64encode(args.iparams.FreshdeskAPI);
    const { Bot, InlineKeyboard } = require('grammy');
    const bot = new Bot(data.iparams.TelegrammAPI, {
      client: {
        canUseWebhookReply: (method) => method === "sendChatAction",
      },
    });
    let userID = data.data.message.from.id
    let messageTelergam = data.data.message
    console.log("External event, got some data: ", data.data.message)
    console.log("External event, got some data: ", data.data.message.from)
    console.log("External event, got some data: ", data);
    let hellokeyboard = new InlineKeyboard()
      .text(data.iparams.keyboardINLINE1, "any data")
      .text(data.iparams.keyboardINLINE2, "any data")

    /**
     * Проверка на левую херню
     * 
     * Проверка на начало
     *    Выдаём выбор если
     * Проверка на выбор выбора
     *    Делаем запись в базе
     * 
     * user:<userId>:state == groupId
     * user:<userId>:type == schoolName|ticketChat|...add some other data if needs
     * 
     */


    console.log("Check for valid message type");
    const uncorrectDataType = [
      messageTelergam.document,
      messageTelergam.voice,
      messageTelergam.audio,
      messageTelergam.sticker
    ];
    const onUndefined = (element) => element != undefined;
    if (uncorrectDataType.some(onUndefined)) {
      bot.api.sendMessage(userID, "Sorry, so far I only understand text messages")
      console.log("Context on wrong data", messageTelergam)
      console.log("Check for valid message type: FAILED");
      return;
    }

    if (messageTelergam.text == '/start') {
      /**
       * Проверяем наличие статуса пользователя в системе, если есть тикет, то говорим ою этом пользователю...
       * Или какие-то другие действия...
       */

      console.log(userID, " using command /start")
      bot.api.sendMessage(userID, data.iparams.HelloMessage, {
        reply_markup: hellokeyboard
      });
      return;
    }

    if (messageTelergam.text == (data.iparams.keyboardINLINE1 || data.iparams.keyboardINLINE2)) {

      /**
       * Сделать проверку на существование тикета. Если тикет уже существует, то return;
       * Чтобы не создавать новые тикеты, если прилетела команда создания тикета
       * Лучше эту проверку вынести в условие текущего if
       */

      console.log(userID, " choosen group");
      let options = {
        headers: {
          Authorization: `Basic ${apibase64}=`
        }
      };
      const url = `https://${data.iparams.creatorDomain}.freshdesk.com/api/v2/groups`;
      console.log("create new URL & options for $request : ", url)
      console.log(options)
      // let fieldname_key = {}
      // $request.get("URL", options)
      //   .then(
      //     function (data) {
      //       //handle "data"
      //       //"data" is a json string with status, headers, and response.
      //       fieldname_key = data;
      //       console.log("REsponse data : ",data)
      //       console.log("Fieldnamekey data : ",fieldname_key)
      //     },
      //     function (error) {
      //       //handle failure
      //       console.log("error ", error)
      //     }
      //   );
      // $request.get(url, options)
      // .then(data => data.JSON())
      // .then(data => {
      //   console.log("This $request.get data: ", data)
      //   // $db.set('user:' + userID + ':type', data.id)
      //   //   .then(data => {
      //   //     if (data.Created) {
      //   //       bot.api.sendMessage(userID, data.iparams.TickedRequest, {
      //   //         reply_markup: { remove_keyboard: true }
      //   //       });
      //   //     }
      //   //     $db.set('user:' + userID + ':status', 'schoolName');
      //   //     let dbget = $db.get('user:'+userID)
      //   //     console.log(dbget)
      //   //   });
      // });
      return;
    }


    /**
     * Если тип schoolName = мы узнаём и записываем название учебного заведения,
     * Если тип ticketChat, то воспринимаем сообщение как комментарий к существующему тикету.
     * 
     * В целом на это месте можно выделить две функции, получение статусов о пользователе и его текущем тикете.
     * 
     * 
     */
    // if(Получили обычный текст) {
    //  Если учебное заведение
    //    Делаем запись в бд
    //  Если чат в тикете
    //    Оставляем коммент в тикете
    // }




    // let fieldname_key = {
    //   servicefields_aviable: false,
    //   studentGroup: null,
    //   customerGroup: null,
    // };
    // switch (messageTelergam.text) {
    //   case '/start':
    //     console.log(userID, " using command /start")
    //     bot.api.sendMessage(userID, data.iparams.HelloMessage, {
    //       reply_markup: hellokeyboard
    //     })
    //   case data.iparams.keyboardINLINE1:
    //   case data.iparams.keyboardINLINE2:
    //     console.log(userID, " choosen group")
    //     bot.api.sendMessage(userID, data.iparams.TickedRequest, {
    //       reply_markup: { remove_keyboard: true }
    //     })

    //   default:
    //     const userTicketAmount = tickets.getTicketsfrom(data, fieldname_key, apibase64, userID);
    //     if (userTicketAmount.total < 1) {
    //       ctx.session.fetch_body_request["name"] = `${messageTelergam.from.first_name}`;
    //       ctx.session.fetch_body_request["description"] = `${messageTelergam.text}`;
    //       ctx.session.fetch_body_request["subject"] = `Telegramm bot issue form ${messageTelergam.from.first_name}`;
    //       ctx.session.fetch_body_request["priority"] = 1;
    //       ctx.session.fetch_body_request["status"] = 2;
    //       ctx.session.fetch_body_request["source"] = 9;
    //       ctx.session.fetch_body_request["unique_external_id"] = `${userID}`;
    //       ctx.session.fetch_body_request["custom_fields"] = {
    //         [fieldname_key.userTelegramId]: userID,
    //         [fieldname_key.userMessageId]: messageTelergam.message_id
    //       };
    //       console.log("Creating new ticket...")
    //       const respones = tickets.createTicket(data, fetch_body_request, apibase64)
    //       console.log(respones)
    //       bot.api.sendMessage(userID, data.iparams.TickedAccepted)

    //     } else {
    //       let infoAboutfirstTicket = userTicketAmount.results[0]
    //       ctx.session.ticket_id = infoAboutfirstTicket.id
    //       ctx.session.requester_id = infoAboutfirstTicket.requester_id
    //       let currentTicket = tickets.viewTicket(data, apibase64, ctx.session.ticket_id)
    //       console.log("An active ticket already exists:")
    //       console.log(currentTicket)
    //       let note = tickets.createNote(data, apibase64, ctx.session.ticket_id, messageTelergam.text, fieldname_key)
    //       console.log(note)
    //     }

    // }
    // if (messageTelergam.text == '/start') {
    //   console.log(userID, " using command /start")
    //   bot.api.sendMessage(userID, data.iparams.HelloMessage, {
    //     reply_markup: hellokeyboard
    //   })
    // }
    // if (messageTelergam.text == (data.iparams.keyboardINLINE1 || data.iparams.keyboardINLINE2)) {
    //   console.log(userID, " choosen group")
    //   bot.api.sendMessage(userID, data.iparams.TickedRequest, {
    //     reply_markup: { remove_keyboard: true }
    //   })
    // }

    // bot.callbackQuery("callback_keyboard2", () => {
    //   bot.api.editMessageCaption(messageTelergam.message_id,{
    //     reply_markup: []
    //   })
    //   bot.api.sendMessage(userID, data.iparams.TickedRequest, {
    //     reply_markup: hellokeyboard
    //   })
    // })
    // bot.callbackQuery("callback_Keyboard1", () => {
    //   bot.api.editMessageCaption(messageTelergam.message_id,{
    //     reply_markup: []
    //   })
    //   bot.api.sendMessage(userID, data.iparams.TickedRequest, {
    //     reply_markup: hellokeyboard
    //   })
    // })


    // bot.on("msg:new_chat_members:is_bot", (ctx) =>{
    //   bot.api.sendMessage(userID, "I'm sorry, so far I'm only communicating with people")
    //   console.log("Context on wrong data : ",ctx)
    // })
  },
  // onConversationCreateCallback: function (payload) {
  //   console.log("================ PAYLOAD =================")
  //   console.log(payload)
  //   console.log("================ ENDLINE =================")
  //   console.log("")
  //   const { Bot } = require("grammy");
  //   const { tickets } = require('./helpers/tickets');
  //   const { base64encode } = require('nodejs-base64');
  //   const apibase64 = base64encode(payload.iparams.FreshdeskAPI);
  //   const bot = new Bot(payload.iparams.TelegrammAPI);
  //   const data = tickets.viewTicket(payload, apibase64, payload.data.conversation.ticket_id)
  //   console.log("================ PAYLOAD ================")
  //   console.log(data)
  //   console.log("================ ENDLINE ================")
  //   console.log("")
  //   bot.api.sendMessage(data.custom_fields.cf_usertelegramid, `${payload.data.conversation.body_text}`)
  //   // испльзуя данные из payload, необходимо создать fetch запрос по тикетам, чтобы узнать telegram_ID пользователя, после чего отправить сообщение с телом payload.body_text
  // }
}