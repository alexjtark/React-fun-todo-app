	class Hello extends React.Component {
		constructor(props){
			super(props);
			this.state = {height: 200, color: "#f7f7f7", theTime: new Date().toLocaleTimeString(), channel: [], location: [], astronomy: []  }
		}
		render() {

			var {name, age, image} = this.props;
			var{height, color, theTime} = this.state;
			var profileStyle = {
				backgroundColor: color,
				WebkitTransition: 'all'
			}
			
			setTimeout(() => {
				this.setState({theTime: new Date().toLocaleTimeString()})
			}, 1000);
				return( <div className="profile" style={profileStyle}>
								<h1>Good Day, {name}</h1>
								<h2>The time is: {theTime}</h2>
								<h3>find out about today:</h3>
								<Weather />
								<button onClick={this.zoomIn.bind(this)}> Zoom In </button>
								<button onClick={this.zoomOut.bind(this)}> Zoom Out </button>
								<br/>
								<h2>Your Inspirational Bill Murray of the Day is:</h2>
								<img src={image} height={height}/>
							</div>
						);
		}
		zoomIn(){
			this.setState({height: this.state.height + 80});
		}
		zoomOut(){
			this.setState({height: this.state.height - 80});
		}

	}

	class Weather extends React.Component {
		constructor(props){
			super(props);
			this.state = { channel: [], location: [], astronomy: [], weather: [] }
		}

		render() {
			var{channel, location, astronomy, weather} = this.state;
			return  ( <div>
								<h3>Todays forecast for {location.city}</h3>
								<h3>Todays Temprature is: {this.toC(weather)} Celcius</h3>
								<h3>sunrise was: {astronomy.sunrise}</h3>
								<h3>sunset will be: {astronomy.sunset}</h3>
								</div>
							)
		}
		componentDidMount() {
    this.getWeather();
  	}

  	toC(temp) {
  		return Math.round((temp - 32) * (5/9));
  	}

		getWeather() {
				$.ajax({
				  url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22toronto%2C%20on%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
				  dataType: 'json',
				  type: 'GET',
				  cache: false,
				  success: function(data) {
				    this.setState({	data: data, 
				    								channel: data.query.results.channel, 
				    								location: data.query.results.channel.location, 
				    								astronomy: data.query.results.channel.astronomy,
				    								weather: data.query.results.channel.item.forecast[0].high
				    							});
				    console.log(data);
				  }.bind(this),
				  error: function(xhr, status, err) {
				    console.error(this.props.url, status, err.toString());
				  }.bind(this)
				});
			}
	}

	class Todo extends React.Component {

		render() {
		
			return (
				<div className="todo-single">
				<button onClick={this.props.onClick}>Delete</button>
				<p>{this.props.text}</p>
				<p>{this.props.complete}</p>
				</div>
				)
		}
	}



	class ToDoForm extends React.Component {
		
		constructor(props) {
			super(props);
			this.state = {text: ""}
		}

		handleSubmit(e) {
			e.preventDefault();
			var text = this.state.text.trim();
			this.props.onTodoSubmit({text: text});
			this.setState({text: ''});
		}

		handleTextChange(e) {
			this.setState({text: e.target.value});
		}		
		  render() {
		  	var text = this.state;
		    return (
		    	<div className="post-div">
			      <form className="post-form" onSubmit={this.handleSubmit.bind(this)}>
			        <input 
			        	className="post-input" 
			        	type="text" 
			        	value={this.state.text} 
			        	placeholder="Add a task"
			        	onChange={this.handleTextChange.bind(this)} />
			        <input className="submit-button" type="submit" />
			      </form>
		      </div>
		    );
		  }

	}

	class TodoList extends React.Component {

		constructor(props){
			super(props);
			this.state = { todos: [] }
		}
		
		removeTodo(post, e) {
			e.preventDefault();
			$.ajax({
			  url: '/todos/' + post.id,
			  dataType: 'json',
			  type: 'DELETE',
			  cache: false,
			  success: function(data) {
			    this.setState({	data: data});
			    this.getTodos();
			  }.bind(this),
			  error: function(xhr, status, err) {
			    console.error(this.props.url, status, err.toString());
			  }.bind(this)
			});

		}

		render() {

		var todos = this.state;
		var todoNodes = this.state.todos.map(function(post) {
		var deleteTodo = this.removeTodo.bind(this, post);
		
			return (
				<Todo text={post.text} key={post.id} complete={post.complete} id={post.id} onClick={deleteTodo}/>
				)
		}, this );

			return  (	<div className="todo-list">
									<h1>What Do You Want to Accomplish Today?</h1>
									<ToDoForm onTodoSubmit={this.postTodos.bind(this)} />
									{todoNodes}
								</div>	
							)
		}
		componentDidMount() {
	    this.getTodos();
  	}

		getTodos() {
				$.ajax({
				  url: '/todos',
				  dataType: 'json',
				  type: 'GET',
				  cache: false,
				  success: function(data) {
				    this.setState({	data: data, todos: data});
				  }.bind(this),
				  error: function(xhr, status, err) {
				    console.error(this.props.url, status, err.toString());
				  }.bind(this)
				});
			}

			postTodos(todo) {
				var listall = this.state.todos;
				todo.id = Date.now();
				var newTodos = listall.concat([todo]);
				this.setState({todos: newTodos});
				$.ajax({
				  url: '/todos',
				  dataType: 'json',
				  type: 'POST',
				  data: { todo: { text: todo.text} },
				  success: function(data) {
				    this.setState({	data: listall});
				    this.getTodos();
				  }.bind(this),
				  error: function(xhr, status, err) {
				    this.setState({data: posts});
				    console.error(this.props.url, status, err.toString());
				  }.bind(this)
				});
			}

	}




	ReactDOM.render(<Hello name="Alex" age={32} image="http://fillmurray.com/200/300"/>, document.getElementById('react-container') );
	ReactDOM.render(<TodoList/>, document.getElementById('todo-app') );



