class AddDescriptionToCourses < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :description, :string
  end
end
