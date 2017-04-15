class Course < ApplicationRecord
	has_many :term
	has_many :plan, through: :term
end
