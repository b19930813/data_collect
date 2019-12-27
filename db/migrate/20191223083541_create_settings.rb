class CreateSettings < ActiveRecord::Migration[5.2]
  def change
    create_table :settings do |t|
      t.string :rest_server
      t.string :opc_ua
      t.string :mqtt

      t.timestamps
    end
  end
end
