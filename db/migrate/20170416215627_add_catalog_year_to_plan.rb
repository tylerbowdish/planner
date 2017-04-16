class AddCatalogYearToPlan < ActiveRecord::Migration[5.0]
  def change
    add_column :plans, :catalogYear, :integer
  end
end
