class Term < ApplicationRecord
  belongs_to :plan
  has_many :term_course
end
