import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { clipboard } from 'electron';

import PrevTranslations from './PrevTranslations';

export default class LoggedIn extends Component {
	static propTypes = {
		onLogout: PropTypes.func.isRequired
	};

	state = {
		word: '',
		searchList: [],
		copied: '',
		languages: [ 'en', 'tr' ],
		autoClipboard: false,
		translations: {
			house: 'ev'
		}
	};

	handleLogout = () => {
		this.props.onLogout({
			username: '',
			loggedIn: false
		});
	};

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	onSubmit = async (e) => {
		e.preventDefault();
		const translationData = await this.translate('en', 'tr', 'house');
		console.log(translationData[0][0]);
		this.setState(
			(prevState) => ({ searchList: [ prevState.word, ...prevState.searchList ] }),
			() => {
				this.setState({ word: '' });
			}
		);
	};

	onPaste = async () => {
		// e.preventDefault();
		const coppied = clipboard.readText();
		if (!coppied) return false;
		const translation = await this.translate('en', 'tr', coppied);
		console.log(translation);
		this.setState(
			(prevState) => ({ searchList: [ clipboard.readText(), ...prevState.searchList ] }),
			() => {
				this.setState({ word: '' });
				this.setState((prev) => {
					const translations = { ...prev.translations };
					translations[translation[0]] = translation[1];
					return { translations };
				});
			}
		);
	};

	translate = async (sourceLang = '', targetLang = '', sourceText) => {
		const url =
			'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' +
			sourceLang +
			'&tl=' +
			targetLang +
			'&dt=t&q=' +
			encodeURI(sourceText);

		const result = await fetch(url);

		const res = await result.json();
		// console.log(res);
		return res[0][0];
	};

	setAuto = () => {
		this.setState(
			(prevstate) => ({ autoClipboard: !prevstate.autoClipboard }),
			() => {
				if (this.state.autoClipboard) {
					this.autoChecker = setInterval(() => {
						const clipboardData = clipboard.readText();
						if (clipboardData !== this.state.copied) {
							this.setState(
								() => ({ copied: clipboardData }),
								() => {
									this.onPaste();
								}
							);
						}
					}, 1000);
				} else {
					clearInterval(this.autoChecker);
				}
			}
		);
	};

	render() {
		return (
			<div className="content">
				<h2>Logged in as {this.props.user.username}</h2>
				<button onClick={this.handleLogout}>Logout</button>

				<div className="search">
					<form onSubmit={this.onSubmit}>
						<label htmlFor="word">Word to search:</label>
						<input type="text" name="word" value={this.state.word} onChange={this.onChange} />
						<input type="submit" value="Search" />
					</form>

					<label>{this.state.word}</label>
				</div>
				<div className="history">
					<ul>{this.state.searchList && this.state.searchList.map((item, index) => <li key={index}> {item} </li>)}</ul>
				</div>
				<button onClick={this.onPaste}>TRANSLATE COPIED</button>
				<label htmlFor="auto">Auto translate clipboard</label>
				<input type="checkbox" name="auto" id="" onChange={this.setAuto} value={this.state.autoClipboard} />
				<label htmlFor="">{this.state.copied}</label>
				<PrevTranslations translations={this.state.translations} />
				<style jsx>{`
					.content {
						display: grid;
					}
					.search {
						margin-top: 20px;
					}
				`}</style>
			</div>
		);
	}
}
