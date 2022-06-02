// const fetch = require("node-fetch");
const tickets = {
	createTicket(args, fetch_body_request, apibase64) {
		const url = `https://${args.iparams.creatorDomain}.freshdesk.com/api/v2/tickets?`;
		try {
			let data = fetch(url, {
				headers: {
					Authorization: `Basic ${apibase64}=`,
					'Content-Type': 'application/json;charset=utf-8'
				},
				method: "POST",
				body: JSON.stringify(fetch_body_request)
			});
			data = data.json();
			return data;
		}
		catch (e) {
			console.log('Create ticket error', e)
		}
	},
	getAllNewFields(args) {
		let headers = { "Authorization": `Basic <%= encode(iparam.FreshdeskAPI) %>` };
		let options = { headers: headers };
		const url = `https://${args.iparams.creatorDomain}.freshdesk.com/api/v2/admin/ticket_fields`
		$request.get(url, options)
			.then(function (data) {
				responseData = JSON.parse(data.response)
					// returnData.forEach(object => {
					// 	if (object.label == ("userMessageId")) {
					// 		responseData[object.label] = object.name
					// 		responseData.servicefields_aviable = true
					// 	}
					// 	if (object.label == ("userTelegramId")) {
					// 		responseData[object.label] = object.name
					// 		responseData.servicefields_aviable = true
					// 	}
					// 	if (object.label == ("НПОО")) {
					// 		responseData["НПОО"] = object.name
					// 	}
					// 	if (object.label == ("Категория проблемы")) {
					// 		responseData["Категория проблемы"] = object.name
					// 	}
					// 	if (object.label == ("Учебное заведение")) {
					// 		responseData["Учебное заведение"] = object.name
					// 	}
					// })
					// console.log(responseData)
					return responseData
				},
				function (error) {
					console.log('getAllNewField error', error);
				},
			)
		// try {
		// 	let data = fetch(url, {
		// 		headers: {
		// 			Authorization: `Basic ${apibase64}=`,
		// 		}
		// 	}
		// 	)
		// 		.then(data => data.json())
		// 	// console.log(data)
		// 	data.forEach(object => {
		// 		if (object.label == ("userMessageId")) {
		// 			fieldname_key[object.label] = object.name
		// 			fieldname_key.servicefields_aviable = true
		// 		}
		// 		if (object.label == ("userTelegramId")) {
		// 			fieldname_key[object.label] = object.name
		// 			fieldname_key.servicefields_aviable = true
		// 		}
		// 		if (object.label == ("НПОО")) {
		// 			fieldname_key["НПОО"] = object.name
		// 		}
		// 		if (object.label == ("Категория проблемы")) {
		// 			fieldname_key["Категория проблемы"] = object.name
		// 		}
		// 		if (object.label == ("Учебное заведение")) {
		// 			fieldname_key["Учебное заведение"] = object.name
		// 		}
		// 	})
		// 	return fieldname_key
		// } catch (e) {
		// }
	},
	createNewServiceField(args, name, apibase64, fieldname_key) {
		const url = `https://${args.iparams.creatorDomain}.freshdesk.com/api/v2/admin/ticket_fields`
		try {
			let data = fetch(url, {
				headers: {
					Authorization: `Basic ${apibase64}=`,
					'Content-Type': 'application/json;charset=utf-8'
				},
				method: "POST",
				body: JSON.stringify({
					"customers_can_edit": false,
					"label_for_customers": name,
					"displayed_to_customers": false,
					"label": name,
					"type": "custom_number",
					"required_for_closure": false,
					"required_for_agents": false,
					"required_for_customers": false,
				})
			});
			// console.log('data',data)
			// console.log('fieldnamekey',fieldname_key)
			// console.log('name',name)
			data = data.json()
			console.log(`Create new freshdesk ticket field: ${name}`)
			fieldname_key[data.label] = data.name
			console.log(fieldname_key)
			return fieldname_key
		} catch (e) {
			console.log('Error, createNewServiceField', e);
		}

	},
	getTicketsfrom(args, fieldname_key, apibase64, userID) {
		let url = `https://${args.iparams.creatorDomain}.freshdesk.com/api/v2/search/tickets?query="${fieldname_key.userTelegramId}:${userID}"`;
		let data = fetch(url, {
			headers: {
				Authorization: `Basic ${apibase64}=`,
			}
		})
		data = data.json();
		return data;
	},
	getGroupId(args, fieldname_key) {
		const url = `https://${args.iparams.creatorDomain}.freshdesk.com/api/v2/groups`;
		try {
			let data = $request.get(url, {
				headers: {
					Authorization: "Basic <% = encode(args.iparams.FreshdeskAPI)",
				},
			});
			data = data.json();
			// console.log(data)
			data.forEach(object => {
				if (object.name == ("Student Support")) {
					fieldname_key.studentGroup = object.id
				}
				if (object.name == ("Customer Support")) {
					fieldname_key.customerGroup = object.id
				}
			})
			return fieldname_key;
		}
		catch (e) {
			console.log('Create ticket error', e)
		}

	},
	viewTicket(args, apibase64, id) {
		const url = `https://${args.iparams.creatorDomain}.freshdesk.com/api/v2/tickets/${id}`;
		try {
			let data = fetch(url, {
				headers: {
					Authorization: `Basic ${apibase64}=`,
				},
			});
			data = data.json();
			// console.log(data)
			return data;
		}
		catch (e) {
			console.log('Create ticket error', e)
		}

	},
	createNote(args, apibase64, id, message, fieldname_key) {
		const url = `https://${args.iparams.creatorDomain}.freshdesk.com/api/v2/tickets/${id}/notes`;
		try {
			let data = fetch(url, {
				headers: {
					Authorization: `Basic ${apibase64}=`,
					'Content-Type': 'application/json;charset=utf-8'
				},
				method: "POST",
				body: JSON.stringify({
					"body": `<div>${message}</div>`,
					"private": false,
					"incoming": true,
					"user_id": fieldname_key.requester_id,
				})
			});
			data = data.json();
			// console.log(data)
			return data;
		}
		catch (e) {
			console.log('Create ticket error', e)
		}

	},
	
}

exports.tickets = tickets;