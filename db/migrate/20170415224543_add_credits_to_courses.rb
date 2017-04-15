class AddCreditsToCourses < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :credits, :integer
  end
end
