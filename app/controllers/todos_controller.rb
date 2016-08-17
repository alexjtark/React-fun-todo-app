class TodosController < ApplicationController

	def index
		@todos = Todo.all
		render json: @todos
	end

	def create
		@todo = Todo.new(todo_params)
		if @todo.save
			render json: @todo
		else
			render json: @todo.errors
		end
	end

	private 

	def todo_params
		params.require(:todo).permit(:text)
	end
end