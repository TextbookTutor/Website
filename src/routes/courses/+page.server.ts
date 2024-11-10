import fs from 'fs/promises';
import path from 'path';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	avatar: async ({ request, route, url }) => {
		try {
			const data = Object.fromEntries(await request.formData());
			const filePath = path.join(
				process.cwd(),
				'static',
				'avatars',
				`${crypto.randomUUID()}.${(data.avatar as Blob).type.split('/')[1]}`
			);
			//@ts-ignore
			await fs.writeFile(filePath, Buffer.from(await (data.avatar as Blob).arrayBuffer()));

// Prepare the file as FormData
			const formData = new FormData();
			formData.append('file', new Blob([await (data.avatar as Blob).arrayBuffer()]), data.avatar.name);

// Send the file via POST request
			let response = await fetch('http://127.0.0.1:8000/gencourse', {
				method: 'POST',
				body: formData
			});
			console.log(response);

			    // .then(function(res) {
			    //     return res.json();
			    // }).then(function(json) {
			//     console.log(json);
			// });
			// TODO: store the file path in database for further references.

		} catch (err) {
			console.log(err);
			// return  fail(500, { err: err })
		}
	},
};
