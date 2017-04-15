class TermCourse < ApplicationRecord
  belongs_to :term
  belongs_to :course
end
