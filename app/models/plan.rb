class Plan < ApplicationRecord
	belongs_to(:user)
	has_many :term
	has_many :course, through: :term
end
