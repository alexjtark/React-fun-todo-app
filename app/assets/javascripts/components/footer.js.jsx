class Footer extends React.Component {

	render() {
		return (
						<div>
							<p>A simple React app built on Rails by Alex Tarkowski.  
								<a className="source-code" href="https://github.com/alexjtark/React-fun-todo-app">
								 Source Code Here
								</a>
							</p>
						</div>
			)
	}
}

ReactDOM.render(<Footer/>, document.getElementById('footer'))