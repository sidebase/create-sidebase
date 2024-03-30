const PROJECT_NAME_NOUNS = ['app', 'project', 'endeavour', 'undertaking', 'enterprise', 'venture', 'experiment', 'effort', 'operation', 'affair', 'pursuit', 'struggle', 'adventure', 'thing', 'opportunity']
export const getRandomProjectNoun = () => PROJECT_NAME_NOUNS[Math.floor((Math.random() * PROJECT_NAME_NOUNS.length))]
