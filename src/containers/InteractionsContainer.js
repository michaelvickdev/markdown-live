import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import getConfig from "next/config";
// import { useSelector } from "react-redux";
import { Box } from "@material-ui/core";

import {
	InteractionSettings,
	InteractionChat,
	ModalLeaveRoom,
	ModalShareRoom,
} from "@/components/molecules";
import { InteractionsPanel } from "@/components/organisms";

const { publicRuntimeConfig } = getConfig();
const { APP_URL } = publicRuntimeConfig;
const initialModals = { leave: false, invite: false };

const InteractionsContainer = ({ socket }) => {
	const router = useRouter();
	// const { name: username } = useSelector(state => state.user);
	const [chatMessages, setChatMessages] = useState([]);
	const [modals, setModals] = useState(initialModals);
	let url = APP_URL + router.asPath;
	url = url.substr(url.indexOf("//") + 2);

	useEffect(() => {
		socket.on("message", ({ id, name, message }) => {
			console.log(message);
			setChatMessages(chatMessages => [...chatMessages, { id, name, message }]);
		});

		return () => {
			setChatMessages([]);
			setModals(initialModals);
		};
		// eslint-disable-next-line
	}, []);

	const handleMessageSubmit = message => {
		// socket.emit("message", { username, message });
	};

	const handleLeave = () => {
		setModals(initialModals);
		socket.disconnect();
		router.push("/");
	};

	return (
		<>
			<ModalShareRoom
				open={modals.invite}
				room={url}
				onClose={() => setModals({ ...modals, invite: false })}
			/>
			<ModalLeaveRoom
				open={modals.leave}
				onMainAction={handleLeave}
				onClose={() => setModals({ ...modals, leave: false })}
			/>
			<InteractionsPanel
				renderSettings={() => (
					<InteractionSettings
						people={[]}
						renderPerson={person => <Box>{person.name}</Box>}
						onInvite={() => setModals({ ...modals, invite: true })}
						onLeave={() => setModals({ ...modals, leave: true })}
					/>
				)}
				renderChat={() => (
					<InteractionChat
						chatMessages={chatMessages}
						onMessageSubmit={handleMessageSubmit}
					/>
				)}
			/>
		</>
	);
};

InteractionsContainer.propTypes = {
	socket: PropTypes.object.isRequired,
};

export default InteractionsContainer;
