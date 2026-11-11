# Aggiunge al progetto Xcode generato da Capacitor:
#  - i file Swift nativi dell'app (plugin Salute/Watch e view controller) e i permessi HealthKit;
#  - il target dell'app Apple Watch (SwiftUI, watchOS 9+) incorporato nell'app iPhone.
# Idempotente: si può eseguire più volte. Usato da Codemagic (gem xcodeproj già presente sui Mac).
# Uso: ruby scripts/add-native-targets.rb
require 'xcodeproj'

PROJECT = File.expand_path('../ios/App/App.xcodeproj', __dir__)
TEAM = 'BUZP7DUAM6'
WATCH_NAME = 'AuraLiftWatch'
WATCH_BUNDLE = 'com.ikonet.auralift.watchkitapp'

project = Xcodeproj::Project.open(PROJECT)
app = project.targets.find { |t| t.name == 'App' } or abort('Target App non trovato')
app_group = project.main_group.children.find { |g| g.respond_to?(:path) && g.path == 'App' } or abort('Gruppo App non trovato')

# ---------------------------------------------------------------- file nativi dell'app iPhone
%w[AuraNativePlugin.swift MainViewController.swift].each do |name|
  next if app_group.files.any? { |f| f.path == name }
  ref = app_group.new_reference(name)
  app.source_build_phase.add_file_reference(ref)
  puts "aggiunto #{name}"
end
app_group.new_reference('App.entitlements') unless app_group.files.any? { |f| f.path == 'App.entitlements' }

app.build_configurations.each do |config|
  config.build_settings['CODE_SIGN_ENTITLEMENTS'] = 'App/App.entitlements'
  config.build_settings['DEVELOPMENT_TEAM'] = TEAM
end

# Framework di sistema (il link automatico di Swift basta, ma rendiamolo esplicito)
%w[HealthKit WatchConnectivity].each do |fw|
  next if app.frameworks_build_phase.files_references.any? { |r| r.path.to_s.end_with?("#{fw}.framework") }
  app.add_system_framework(fw)
end

# ---------------------------------------------------------------- target Apple Watch
watch = project.targets.find { |t| t.name == WATCH_NAME }
unless watch
  watch = project.new_target(:application, WATCH_NAME, :watchos, '9.0', nil, :swift)
  group = project.main_group.new_group(WATCH_NAME, WATCH_NAME)
  %w[AuraLiftWatchApp.swift ContentView.swift WatchSession.swift].each do |name|
    watch.source_build_phase.add_file_reference(group.new_reference(name))
  end
  watch.resources_build_phase.add_file_reference(group.new_reference('Assets.xcassets'))
  group.new_reference('Info.plist')
  puts "creato target #{WATCH_NAME}"
end

watch.build_configurations.each do |config|
  s = config.build_settings
  s['PRODUCT_BUNDLE_IDENTIFIER'] = WATCH_BUNDLE
  s['PRODUCT_NAME'] = '$(TARGET_NAME)'
  s['INFOPLIST_FILE'] = "#{WATCH_NAME}/Info.plist"
  s['GENERATE_INFOPLIST_FILE'] = 'NO'
  s['SDKROOT'] = 'watchos'
  s['WATCHOS_DEPLOYMENT_TARGET'] = '9.0'
  s['TARGETED_DEVICE_FAMILY'] = '4'
  s['SWIFT_VERSION'] = '5.0'
  s['ASSETCATALOG_COMPILER_APPICON_NAME'] = 'AppIcon'
  s['SKIP_INSTALL'] = 'YES'
  s['DEVELOPMENT_TEAM'] = TEAM
  s['CODE_SIGN_STYLE'] = 'Manual'
  s['MARKETING_VERSION'] = app.build_configurations.first.build_settings['MARKETING_VERSION'] || '1.0'
  s['CURRENT_PROJECT_VERSION'] = '1'
  s['LD_RUNPATH_SEARCH_PATHS'] = ['$(inherited)', '@executable_path/Frameworks']
  s['ENABLE_PREVIEWS'] = 'NO'
end

# Incorpora l'app Watch nell'app iPhone
embed = app.copy_files_build_phases.find { |p| p.name == 'Embed Watch Content' }
unless embed
  embed = app.new_copy_files_build_phase('Embed Watch Content')
  embed.dst_subfolder_spec = '16'
  embed.dst_path = '$(CONTENTS_FOLDER_PATH)/Watch'
end
unless embed.files_references.include?(watch.product_reference)
  build_file = embed.add_file_reference(watch.product_reference)
  build_file.settings = { 'ATTRIBUTES' => ['RemoveHeaderOnCopy'] }
end
app.add_dependency(watch) unless app.dependencies.any? { |d| d.target == watch }

project.save
puts 'progetto aggiornato'
