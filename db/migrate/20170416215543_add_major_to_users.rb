class AddMajorToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :major, :string
  end
end
