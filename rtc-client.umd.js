(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('fs'), require('path'), require('os'), require('crypto'), require('util')) :
	typeof define === 'function' && define.amd ? define(['fs', 'path', 'os', 'crypto', 'util'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.RtcLib = factory(global.require$$0$2, global.require$$1, global.require$$2, global.require$$3, global.require$$0$3));
})(this, (function (require$$0$2, require$$1, require$$2, require$$3, require$$0$3) { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
	  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				var isInstance = false;
	      try {
	        isInstance = this instanceof a;
	      } catch {}
				if (isInstance) {
	        return Reflect.construct(f, arguments, this.constructor);
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var type;
	var hasRequiredType;

	function requireType () {
		if (hasRequiredType) return type;
		hasRequiredType = 1;
		const dataTypes = Object.freeze({
		    RAW: 0,
		    ICE: 1,
		    SDP: 2,
		    JOIN_REQUEST: 65409,
		    JOIN_INFO: 65535,
		    GROUP_INFO: 65533,
		    LEAVE_INFO: 65531,
		    SET_TOPICS: 205
		});

		type = { dataTypes };
		return type;
	}

	var view;
	var hasRequiredView;

	function requireView () {
		if (hasRequiredView) return view;
		hasRequiredView = 1;
		class MutableView {
		    static INT8_NUM_BYTES = 1;
		    static INT16_NUM_BYTES = 2;
		    static ARRAY_LEN_NUM_BYTES = 2;
		    static STRING_LEN_NUM_BYTES = 2;

		    constructor(view) {
		        this.view = view;
		    }

		    getInt8(i) {
		        return this.view.getInt8(i);
		    }

		    setInt8(i, v) {
		        this.view.setInt8(i, v);
		    }

		    getUint8(i) {
		        return this.view.getUint8(i);
		    }

		    setUint8(i, v) {
		        this.view.setUint8(i, v);
		    }

		    getInt16(i) {
		        return this.view.getInt16(i);
		    }

		    setInt16(i, v) {
		        this.view.setInt16(i, v);
		    }

		    getUint16(i) {
		        return this.view.getUint16(i);
		    }

		    setUint16(i, v) {
		        this.view.setUint16(i, v);
		    }

		    seek(amount) {
		        if (amount > this.view.byteLength) {
		            throw new Error('Cannot seek more than data length')
		        }
		        this.view = new DataView(this.view.buffer, this.view.byteOffset + amount, this.view.byteLength - amount);
		    }

		    readInt8() {
		        var x = this.getInt8(0);
		        this.seek(MutableView.INT8_NUM_BYTES);
		        return x;
		    }

		    writeInt8(x) {
		        this.setInt8(0, x);
		        this.seek(MutableView.INT8_NUM_BYTES);
		    }

		    readUint8() {
		        var x = this.getUint8(0);
		        this.seek(MutableView.INT8_NUM_BYTES);
		        return x;
		    }

		    writeUint8(x) {
		        this.setUint8(0, x);
		        this.seek(MutableView.INT8_NUM_BYTES);
		    }

		    readInt16() {
		        var x = this.getInt16(0);
		        this.seek(MutableView.INT16_NUM_BYTES);
		        return x;
		    }

		    writeInt16(x) {
		        this.setInt16(0, x);
		        this.seek(MutableView.INT16_NUM_BYTES);
		    }

		    readUint16() {
		        var x = this.getUint16(0);
		        this.seek(MutableView.INT16_NUM_BYTES);
		        return x;
		    }

		    writeUint16(x) {
		        this.setUint16(0, x);
		        this.seek(MutableView.INT16_NUM_BYTES);
		    }

		    readBytes() {
		        let length = this.readInt16();
		        let bytes = new Int8Array(length);
		        for (let i = 0; i < length; i++) {
		            bytes[i] = this.readInt8();
		        }
		        return bytes;
		    }

		    writeBytes(bytes) {
		        this.writeInt16(bytes.length);    
		        for (let i = 0; i < bytes.length; i++) {
		            this.writeInt8(bytes[i]);
		        }
		    }

		    readString() {
		        let length = this.readInt16();
		        let bytes = new Uint8Array(length);
		        for (let i = 0; i < length; i++) {
		            bytes[i] = this.readUint8();
		        }
		        let decoder = new TextDecoder();
		        return decoder.decode(bytes);
		    }

		    writeString(string) {
		        let encoder = new TextEncoder();
		        let bytes = encoder.encode(string);
		        this.writeInt16(bytes.length);
		        for (let i = 0; i < bytes.length; i++) {
		            this.writeUint8(bytes[i]);
		        }
		    }
		}

		view = { MutableView };
		return view;
	}

	var ice;
	var hasRequiredIce;

	function requireIce () {
		if (hasRequiredIce) return ice;
		hasRequiredIce = 1;
		const { dataTypes } = requireType();
		const { MutableView } = requireView();

		class IceCandidateData {
		    static TYPE = dataTypes.ICE;

		    constructor(iceCandidate = '') {
		        this.iceCandidate = iceCandidate;
		    }

		    length() {
		        return MutableView.STRING_LEN_NUM_BYTES + this.iceCandidate.length;
		    }

		    serialize(view) {
		        view.writeString(this.iceCandidate);
		    }

		    deserialize(view) {
		        this.iceCandidate = view.readString();
		    }
		}

		ice = { IceCandidateData };
		return ice;
	}

	var sdp;
	var hasRequiredSdp;

	function requireSdp () {
		if (hasRequiredSdp) return sdp;
		hasRequiredSdp = 1;
		const { dataTypes } = requireType();
		const { MutableView } = requireView();

		class RemoteSdpData {
		    static TYPE = dataTypes.SDP;

		    constructor(sdpType = '', sdpCandidate = '') {
		        this.sdpType = sdpType;
		        this.sdpCandidate = sdpCandidate;
		    }

		    length() {
		        return MutableView.STRING_LEN_NUM_BYTES + this.sdpType.length + MutableView.STRING_LEN_NUM_BYTES + this.sdpCandidate.length;
		    }

		    serialize(view) {
		        view.writeString(this.sdpType);
		        view.writeString(this.sdpCandidate);
		    }

		    deserialize(view) {
		        this.sdpType = view.readString();
		        this.sdpCandidate = view.readString();
		    }
		}

		sdp = { RemoteSdpData };
		return sdp;
	}

	var raw$1;
	var hasRequiredRaw$1;

	function requireRaw$1 () {
		if (hasRequiredRaw$1) return raw$1;
		hasRequiredRaw$1 = 1;
		const { dataTypes } = requireType();
		const { MutableView } = requireView();

		class RawData {
		    static TYPE = dataTypes.RAW;

		    constructor(data = []) {
		        this.data = data;
		    }

		    length() {
		        return MutableView.ARRAY_LEN_NUM_BYTES + this.data.length;
		    }

		    serialize(view) {
		        view.writeBytes(this.data);
		    }

		    deserialize(view) {
		        this.data = view.readBytes();
		    }
		}

		raw$1 = { RawData };
		return raw$1;
	}

	var join_request;
	var hasRequiredJoin_request;

	function requireJoin_request () {
		if (hasRequiredJoin_request) return join_request;
		hasRequiredJoin_request = 1;
		const { dataTypes } = requireType();
		const { MutableView } = requireView();

		class JoinRequest {
		    static TYPE = dataTypes.JOIN_REQUEST;

		    constructor(topics = '*', data = []) {
		        this.topics = topics;
		        this.data = data;
		    }

		    length() {
		        return MutableView.STRING_LEN_NUM_BYTES + this.topics.length + MutableView.ARRAY_LEN_NUM_BYTES + this.data.length;
		    }

		    serialize(view) {
		        view.writeString(this.topics);
		        view.writeBytes(this.data);
		    }

		    deserialize(view) {
		        this.topics = view.readString();
		        this.data = view.readBytes();
		    }
		}

		join_request = { JoinRequest };
		return join_request;
	}

	var join_info;
	var hasRequiredJoin_info;

	function requireJoin_info () {
		if (hasRequiredJoin_info) return join_info;
		hasRequiredJoin_info = 1;
		const { dataTypes } = requireType();
		const { MutableView } = requireView();

		class JoinInfo {
		    static TYPE = dataTypes.JOIN_INFO;

		    constructor(id = 0, topics = '*', data = []) {
		        this.id = id;
		        this.topics = topics;
		        this.data = data;
		    }

		    length() {
		        return MutableView.INT16_NUM_BYTES + MutableView.STRING_LEN_NUM_BYTES + this.topics.length + MutableView.ARRAY_LEN_NUM_BYTES + this.data.length;
		    }

		    serialize(view) {
		        view.writeUint16(this.id);
		        view.writeString(this.topics);
		        view.writeBytes(this.data);
		    }

		    deserialize(view) {
		        this.id = view.readUint16();
		        this.topics = view.readString();
		        this.data = view.readBytes();
		    }
		}

		join_info = { JoinInfo };
		return join_info;
	}

	var leave_info;
	var hasRequiredLeave_info;

	function requireLeave_info () {
		if (hasRequiredLeave_info) return leave_info;
		hasRequiredLeave_info = 1;
		const { dataTypes } = requireType();
		const { MutableView } = requireView();

		class LeaveInfo {
		    static TYPE = dataTypes.LEAVE_INFO;

		    constructor(id = 0) {
		        this.id = id;
		    }

		    length() {
		        return MutableView.INT16_NUM_BYTES;
		    }

		    serialize(view) {
		        view.writeUint16(this.id);
		    }

		    deserialize(view) {
		        this.id = view.readUint16();
		    }
		}

		leave_info = { LeaveInfo };
		return leave_info;
	}

	var set_topics;
	var hasRequiredSet_topics;

	function requireSet_topics () {
		if (hasRequiredSet_topics) return set_topics;
		hasRequiredSet_topics = 1;
		const { dataTypes } = requireType();
		const { MutableView } = requireView();

		class SetTopics {
		    static TYPE = dataTypes.SET_TOPICS;

		    constructor(id = 0, topics = '*') {
		        this.id = id;
		        this.topics = topics;
		    }

		    length() {
		        return MutableView.INT16_NUM_BYTES + MutableView.STRING_LEN_NUM_BYTES + this.topics.length;
		    }

		    serialize(view) {
		        view.writeUint16(this.id);
		        view.writeString(this.topics);
		    }

		    deserialize(view) {
		        this.id = view.readUint16();
		        this.topics = view.readString();
		    }
		}

		set_topics = { SetTopics };
		return set_topics;
	}

	var group_info;
	var hasRequiredGroup_info;

	function requireGroup_info () {
		if (hasRequiredGroup_info) return group_info;
		hasRequiredGroup_info = 1;
		const { JoinInfo } = requireJoin_info();
		const { dataTypes } = requireType();
		const { MutableView } = requireView();

		class GroupInfo {
		    static TYPE = dataTypes.GROUP_INFO;

		    constructor(id = 0, joinInfos = []) {
		        this.id = id;
		        this.joinInfos = joinInfos;
		    }

		    length() {
		        return MutableView.INT16_NUM_BYTES + MutableView.ARRAY_LEN_NUM_BYTES + this.joinInfos.map(i => i.length()).reduce((a, v) => a + v, 0);
		    }

		    serialize(view) {
		        view.writeUint16(this.id);
		        view.writeInt16(this.joinInfos.length);
		        for (let joinInfo of this.joinInfos) {
		            joinInfo.serialize(view);
		        }
		    }

		    deserialize(view) {
		        this.id = view.readUint16();
		        this.joinInfos = [];
		        let length = view.readInt16();
		        for (let i = 0; i < length; i++) {
		            let joinInfo = new JoinInfo();
		            joinInfo.deserialize(view);
		            this.joinInfos.push(joinInfo);
		        }
		    }
		}

		group_info = { GroupInfo };
		return group_info;
	}

	var _class;
	var hasRequired_class;

	function require_class () {
		if (hasRequired_class) return _class;
		hasRequired_class = 1;
		const { RawData } = requireRaw$1();
		const { IceCandidateData } = requireIce();
		const { RemoteSdpData } = requireSdp();
		const { JoinRequest } = requireJoin_request();
		const { JoinInfo } = requireJoin_info();
		const { LeaveInfo } = requireLeave_info();
		const { SetTopics } = requireSet_topics();
		const { GroupInfo } = requireGroup_info();

		const dataClasses = Object.freeze({
		    0: RawData,
		    1: IceCandidateData,
		    2: RemoteSdpData,
		    65409: JoinRequest,
		    65535: JoinInfo,
		    65533: GroupInfo,
		    65531: LeaveInfo,
		    205: SetTopics
		});

		_class = { dataClasses };
		return _class;
	}

	var simple;
	var hasRequiredSimple;

	function requireSimple () {
		if (hasRequiredSimple) return simple;
		hasRequiredSimple = 1;
		const { RawData } = requireRaw$1();
		const { dataClasses } = require_class();
		const { MutableView } = requireView();

		class SimpleDataMessage {
		    constructor(channel = '', data = new RawData()) {
		        this.channel = channel;
		        this.data = data;
		    }

		    length() {
		        return MutableView.STRING_LEN_NUM_BYTES + this.channel.length + MutableView.INT16_NUM_BYTES + this.data.length();
		    }

		    serialize(view) {
		        view.writeString(this.channel);
		        view.writeUint16(this.data.constructor.TYPE);
		        this.data.serialize(view);
		    }

		    deserialize(view) {
		        this.channel = view.readString();
		        let type = view.readUint16();
		        this.data = new dataClasses[type]();
		        this.data.deserialize(view);
		    }

		    toBuffer() {
		        const buffer = new ArrayBuffer(this.length());
		        this.serialize(new MutableView(new DataView(buffer)));
		        return buffer;
		    }

		    static fromBuffer(buffer) {
		        const message = new SimpleDataMessage();
		        message.deserialize(new MutableView(new DataView(buffer)));
		        return message;
		    }
		}

		simple = { SimpleDataMessage };
		return simple;
	}

	var main = {exports: {}};

	var version = "16.6.1";
	var require$$4 = {
		version: version};

	var hasRequiredMain;

	function requireMain () {
		if (hasRequiredMain) return main.exports;
		hasRequiredMain = 1;
		const fs = require$$0$2;
		const path = require$$1;
		const os = require$$2;
		const crypto = require$$3;
		const packageJson = require$$4;

		const version = packageJson.version;

		const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;

		// Parse src into an Object
		function parse (src) {
		  const obj = {};

		  // Convert buffer to string
		  let lines = src.toString();

		  // Convert line breaks to same format
		  lines = lines.replace(/\r\n?/mg, '\n');

		  let match;
		  while ((match = LINE.exec(lines)) != null) {
		    const key = match[1];

		    // Default undefined or null to empty string
		    let value = (match[2] || '');

		    // Remove whitespace
		    value = value.trim();

		    // Check if double quoted
		    const maybeQuote = value[0];

		    // Remove surrounding quotes
		    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2');

		    // Expand newlines if double quoted
		    if (maybeQuote === '"') {
		      value = value.replace(/\\n/g, '\n');
		      value = value.replace(/\\r/g, '\r');
		    }

		    // Add to object
		    obj[key] = value;
		  }

		  return obj
		}

		function _parseVault (options) {
		  options = options || {};

		  const vaultPath = _vaultPath(options);
		  options.path = vaultPath; // parse .env.vault
		  const result = DotenvModule.configDotenv(options);
		  if (!result.parsed) {
		    const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
		    err.code = 'MISSING_DATA';
		    throw err
		  }

		  // handle scenario for comma separated keys - for use with key rotation
		  // example: DOTENV_KEY="dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=prod,dotenv://:key_7890@dotenvx.com/vault/.env.vault?environment=prod"
		  const keys = _dotenvKey(options).split(',');
		  const length = keys.length;

		  let decrypted;
		  for (let i = 0; i < length; i++) {
		    try {
		      // Get full key
		      const key = keys[i].trim();

		      // Get instructions for decrypt
		      const attrs = _instructions(result, key);

		      // Decrypt
		      decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);

		      break
		    } catch (error) {
		      // last key
		      if (i + 1 >= length) {
		        throw error
		      }
		      // try next key
		    }
		  }

		  // Parse decrypted .env string
		  return DotenvModule.parse(decrypted)
		}

		function _warn (message) {
		  console.log(`[dotenv@${version}][WARN] ${message}`);
		}

		function _debug (message) {
		  console.log(`[dotenv@${version}][DEBUG] ${message}`);
		}

		function _log (message) {
		  console.log(`[dotenv@${version}] ${message}`);
		}

		function _dotenvKey (options) {
		  // prioritize developer directly setting options.DOTENV_KEY
		  if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
		    return options.DOTENV_KEY
		  }

		  // secondary infra already contains a DOTENV_KEY environment variable
		  if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
		    return process.env.DOTENV_KEY
		  }

		  // fallback to empty string
		  return ''
		}

		function _instructions (result, dotenvKey) {
		  // Parse DOTENV_KEY. Format is a URI
		  let uri;
		  try {
		    uri = new URL(dotenvKey);
		  } catch (error) {
		    if (error.code === 'ERR_INVALID_URL') {
		      const err = new Error('INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development');
		      err.code = 'INVALID_DOTENV_KEY';
		      throw err
		    }

		    throw error
		  }

		  // Get decrypt key
		  const key = uri.password;
		  if (!key) {
		    const err = new Error('INVALID_DOTENV_KEY: Missing key part');
		    err.code = 'INVALID_DOTENV_KEY';
		    throw err
		  }

		  // Get environment
		  const environment = uri.searchParams.get('environment');
		  if (!environment) {
		    const err = new Error('INVALID_DOTENV_KEY: Missing environment part');
		    err.code = 'INVALID_DOTENV_KEY';
		    throw err
		  }

		  // Get ciphertext payload
		  const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
		  const ciphertext = result.parsed[environmentKey]; // DOTENV_VAULT_PRODUCTION
		  if (!ciphertext) {
		    const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
		    err.code = 'NOT_FOUND_DOTENV_ENVIRONMENT';
		    throw err
		  }

		  return { ciphertext, key }
		}

		function _vaultPath (options) {
		  let possibleVaultPath = null;

		  if (options && options.path && options.path.length > 0) {
		    if (Array.isArray(options.path)) {
		      for (const filepath of options.path) {
		        if (fs.existsSync(filepath)) {
		          possibleVaultPath = filepath.endsWith('.vault') ? filepath : `${filepath}.vault`;
		        }
		      }
		    } else {
		      possibleVaultPath = options.path.endsWith('.vault') ? options.path : `${options.path}.vault`;
		    }
		  } else {
		    possibleVaultPath = path.resolve(process.cwd(), '.env.vault');
		  }

		  if (fs.existsSync(possibleVaultPath)) {
		    return possibleVaultPath
		  }

		  return null
		}

		function _resolveHome (envPath) {
		  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath
		}

		function _configVault (options) {
		  const debug = Boolean(options && options.debug);
		  const quiet = options && 'quiet' in options ? options.quiet : true;

		  if (debug || !quiet) {
		    _log('Loading env from encrypted .env.vault');
		  }

		  const parsed = DotenvModule._parseVault(options);

		  let processEnv = process.env;
		  if (options && options.processEnv != null) {
		    processEnv = options.processEnv;
		  }

		  DotenvModule.populate(processEnv, parsed, options);

		  return { parsed }
		}

		function configDotenv (options) {
		  const dotenvPath = path.resolve(process.cwd(), '.env');
		  let encoding = 'utf8';
		  const debug = Boolean(options && options.debug);
		  const quiet = options && 'quiet' in options ? options.quiet : true;

		  if (options && options.encoding) {
		    encoding = options.encoding;
		  } else {
		    if (debug) {
		      _debug('No encoding is specified. UTF-8 is used by default');
		    }
		  }

		  let optionPaths = [dotenvPath]; // default, look for .env
		  if (options && options.path) {
		    if (!Array.isArray(options.path)) {
		      optionPaths = [_resolveHome(options.path)];
		    } else {
		      optionPaths = []; // reset default
		      for (const filepath of options.path) {
		        optionPaths.push(_resolveHome(filepath));
		      }
		    }
		  }

		  // Build the parsed data in a temporary object (because we need to return it).  Once we have the final
		  // parsed data, we will combine it with process.env (or options.processEnv if provided).
		  let lastError;
		  const parsedAll = {};
		  for (const path of optionPaths) {
		    try {
		      // Specifying an encoding returns a string instead of a buffer
		      const parsed = DotenvModule.parse(fs.readFileSync(path, { encoding }));

		      DotenvModule.populate(parsedAll, parsed, options);
		    } catch (e) {
		      if (debug) {
		        _debug(`Failed to load ${path} ${e.message}`);
		      }
		      lastError = e;
		    }
		  }

		  let processEnv = process.env;
		  if (options && options.processEnv != null) {
		    processEnv = options.processEnv;
		  }

		  DotenvModule.populate(processEnv, parsedAll, options);

		  if (debug || !quiet) {
		    const keysCount = Object.keys(parsedAll).length;
		    const shortPaths = [];
		    for (const filePath of optionPaths) {
		      try {
		        const relative = path.relative(process.cwd(), filePath);
		        shortPaths.push(relative);
		      } catch (e) {
		        if (debug) {
		          _debug(`Failed to load ${filePath} ${e.message}`);
		        }
		        lastError = e;
		      }
		    }

		    _log(`injecting env (${keysCount}) from ${shortPaths.join(',')}`);
		  }

		  if (lastError) {
		    return { parsed: parsedAll, error: lastError }
		  } else {
		    return { parsed: parsedAll }
		  }
		}

		// Populates process.env from .env file
		function config (options) {
		  // fallback to original dotenv if DOTENV_KEY is not set
		  if (_dotenvKey(options).length === 0) {
		    return DotenvModule.configDotenv(options)
		  }

		  const vaultPath = _vaultPath(options);

		  // dotenvKey exists but .env.vault file does not exist
		  if (!vaultPath) {
		    _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);

		    return DotenvModule.configDotenv(options)
		  }

		  return DotenvModule._configVault(options)
		}

		function decrypt (encrypted, keyStr) {
		  const key = Buffer.from(keyStr.slice(-64), 'hex');
		  let ciphertext = Buffer.from(encrypted, 'base64');

		  const nonce = ciphertext.subarray(0, 12);
		  const authTag = ciphertext.subarray(-16);
		  ciphertext = ciphertext.subarray(12, -16);

		  try {
		    const aesgcm = crypto.createDecipheriv('aes-256-gcm', key, nonce);
		    aesgcm.setAuthTag(authTag);
		    return `${aesgcm.update(ciphertext)}${aesgcm.final()}`
		  } catch (error) {
		    const isRange = error instanceof RangeError;
		    const invalidKeyLength = error.message === 'Invalid key length';
		    const decryptionFailed = error.message === 'Unsupported state or unable to authenticate data';

		    if (isRange || invalidKeyLength) {
		      const err = new Error('INVALID_DOTENV_KEY: It must be 64 characters long (or more)');
		      err.code = 'INVALID_DOTENV_KEY';
		      throw err
		    } else if (decryptionFailed) {
		      const err = new Error('DECRYPTION_FAILED: Please check your DOTENV_KEY');
		      err.code = 'DECRYPTION_FAILED';
		      throw err
		    } else {
		      throw error
		    }
		  }
		}

		// Populate process.env with parsed values
		function populate (processEnv, parsed, options = {}) {
		  const debug = Boolean(options && options.debug);
		  const override = Boolean(options && options.override);

		  if (typeof parsed !== 'object') {
		    const err = new Error('OBJECT_REQUIRED: Please check the processEnv argument being passed to populate');
		    err.code = 'OBJECT_REQUIRED';
		    throw err
		  }

		  // Set process.env
		  for (const key of Object.keys(parsed)) {
		    if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
		      if (override === true) {
		        processEnv[key] = parsed[key];
		      }

		      if (debug) {
		        if (override === true) {
		          _debug(`"${key}" is already defined and WAS overwritten`);
		        } else {
		          _debug(`"${key}" is already defined and was NOT overwritten`);
		        }
		      }
		    } else {
		      processEnv[key] = parsed[key];
		    }
		  }
		}

		const DotenvModule = {
		  configDotenv,
		  _configVault,
		  _parseVault,
		  config,
		  decrypt,
		  parse,
		  populate
		};

		main.exports.configDotenv = DotenvModule.configDotenv;
		main.exports._configVault = DotenvModule._configVault;
		main.exports._parseVault = DotenvModule._parseVault;
		main.exports.config = DotenvModule.config;
		main.exports.decrypt = DotenvModule.decrypt;
		main.exports.parse = DotenvModule.parse;
		main.exports.populate = DotenvModule.populate;

		main.exports = DotenvModule;
		return main.exports;
	}

	function commonjsRequire(path) {
		throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
	}

	var config$1 = {exports: {}};

	var defer = {};

	var hasRequiredDefer;

	function requireDefer () {
		if (hasRequiredDefer) return defer;
		hasRequiredDefer = 1;
		// Create a deferredConfig prototype so that we can check for it when reviewing the configs later.
		function DeferredConfig() {}
		DeferredConfig.prototype.prepare = function() {};
		DeferredConfig.prototype.resolve = function() {};

		// Accept a function that we'll use to resolve this value later and return a 'deferred' configuration value to resolve it later.
		function deferConfig(func) {
		  var obj = Object.create(DeferredConfig.prototype);
		  obj.prepare = function(config, prop, property) {
		    var original = prop[property]._original;
		    obj.resolve = function() {
		      var value = func.call(config, config, original);
		      Object.defineProperty(prop, property, {value: value});
		      return value;
		    };
		    Object.defineProperty(prop, property, {get: function() { return obj.resolve(); }});
		    return obj;
		  };
		  return obj;
		}

		defer.deferConfig = deferConfig;
		defer.DeferredConfig = DeferredConfig;
		return defer;
	}

	var raw = {};

	/**
	 * This is meant to wrap configuration objects that should be left as is,
	 * meaning that the object or its prototype will not be modified in any way
	 */

	var hasRequiredRaw;

	function requireRaw () {
		if (hasRequiredRaw) return raw;
		hasRequiredRaw = 1;
		function RawConfig () {
		}

		function raw$1(rawObj) {
		  var obj = Object.create(RawConfig.prototype);
		  obj.resolve = function () { return rawObj; };
		  return obj;
		}

		raw.RawConfig = RawConfig;
		raw.raw = raw$1;
		return raw;
	}

	var parser = {exports: {}};

	// This is a generated file. Do not edit.
	var Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/;
	var ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
	var ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;

	var unicode = {
		Space_Separator: Space_Separator,
		ID_Start: ID_Start,
		ID_Continue: ID_Continue
	};

	var util = {
	    isSpaceSeparator (c) {
	        return typeof c === 'string' && unicode.Space_Separator.test(c)
	    },

	    isIdStartChar (c) {
	        return typeof c === 'string' && (
	            (c >= 'a' && c <= 'z') ||
	        (c >= 'A' && c <= 'Z') ||
	        (c === '$') || (c === '_') ||
	        unicode.ID_Start.test(c)
	        )
	    },

	    isIdContinueChar (c) {
	        return typeof c === 'string' && (
	            (c >= 'a' && c <= 'z') ||
	        (c >= 'A' && c <= 'Z') ||
	        (c >= '0' && c <= '9') ||
	        (c === '$') || (c === '_') ||
	        (c === '\u200C') || (c === '\u200D') ||
	        unicode.ID_Continue.test(c)
	        )
	    },

	    isDigit (c) {
	        return typeof c === 'string' && /[0-9]/.test(c)
	    },

	    isHexDigit (c) {
	        return typeof c === 'string' && /[0-9A-Fa-f]/.test(c)
	    },
	};

	let source;
	let parseState;
	let stack;
	let pos;
	let line;
	let column;
	let token;
	let key;
	let root;

	var parse = function parse (text, reviver) {
	    source = String(text);
	    parseState = 'start';
	    stack = [];
	    pos = 0;
	    line = 1;
	    column = 0;
	    token = undefined;
	    key = undefined;
	    root = undefined;

	    do {
	        token = lex();

	        // This code is unreachable.
	        // if (!parseStates[parseState]) {
	        //     throw invalidParseState()
	        // }

	        parseStates[parseState]();
	    } while (token.type !== 'eof')

	    if (typeof reviver === 'function') {
	        return internalize({'': root}, '', reviver)
	    }

	    return root
	};

	function internalize (holder, name, reviver) {
	    const value = holder[name];
	    if (value != null && typeof value === 'object') {
	        if (Array.isArray(value)) {
	            for (let i = 0; i < value.length; i++) {
	                const key = String(i);
	                const replacement = internalize(value, key, reviver);
	                if (replacement === undefined) {
	                    delete value[key];
	                } else {
	                    Object.defineProperty(value, key, {
	                        value: replacement,
	                        writable: true,
	                        enumerable: true,
	                        configurable: true,
	                    });
	                }
	            }
	        } else {
	            for (const key in value) {
	                const replacement = internalize(value, key, reviver);
	                if (replacement === undefined) {
	                    delete value[key];
	                } else {
	                    Object.defineProperty(value, key, {
	                        value: replacement,
	                        writable: true,
	                        enumerable: true,
	                        configurable: true,
	                    });
	                }
	            }
	        }
	    }

	    return reviver.call(holder, name, value)
	}

	let lexState;
	let buffer;
	let doubleQuote;
	let sign;
	let c;

	function lex () {
	    lexState = 'default';
	    buffer = '';
	    doubleQuote = false;
	    sign = 1;

	    for (;;) {
	        c = peek();

	        // This code is unreachable.
	        // if (!lexStates[lexState]) {
	        //     throw invalidLexState(lexState)
	        // }

	        const token = lexStates[lexState]();
	        if (token) {
	            return token
	        }
	    }
	}

	function peek () {
	    if (source[pos]) {
	        return String.fromCodePoint(source.codePointAt(pos))
	    }
	}

	function read () {
	    const c = peek();

	    if (c === '\n') {
	        line++;
	        column = 0;
	    } else if (c) {
	        column += c.length;
	    } else {
	        column++;
	    }

	    if (c) {
	        pos += c.length;
	    }

	    return c
	}

	const lexStates = {
	    default () {
	        switch (c) {
	        case '\t':
	        case '\v':
	        case '\f':
	        case ' ':
	        case '\u00A0':
	        case '\uFEFF':
	        case '\n':
	        case '\r':
	        case '\u2028':
	        case '\u2029':
	            read();
	            return

	        case '/':
	            read();
	            lexState = 'comment';
	            return

	        case undefined:
	            read();
	            return newToken('eof')
	        }

	        if (util.isSpaceSeparator(c)) {
	            read();
	            return
	        }

	        // This code is unreachable.
	        // if (!lexStates[parseState]) {
	        //     throw invalidLexState(parseState)
	        // }

	        return lexStates[parseState]()
	    },

	    comment () {
	        switch (c) {
	        case '*':
	            read();
	            lexState = 'multiLineComment';
	            return

	        case '/':
	            read();
	            lexState = 'singleLineComment';
	            return
	        }

	        throw invalidChar(read())
	    },

	    multiLineComment () {
	        switch (c) {
	        case '*':
	            read();
	            lexState = 'multiLineCommentAsterisk';
	            return

	        case undefined:
	            throw invalidChar(read())
	        }

	        read();
	    },

	    multiLineCommentAsterisk () {
	        switch (c) {
	        case '*':
	            read();
	            return

	        case '/':
	            read();
	            lexState = 'default';
	            return

	        case undefined:
	            throw invalidChar(read())
	        }

	        read();
	        lexState = 'multiLineComment';
	    },

	    singleLineComment () {
	        switch (c) {
	        case '\n':
	        case '\r':
	        case '\u2028':
	        case '\u2029':
	            read();
	            lexState = 'default';
	            return

	        case undefined:
	            read();
	            return newToken('eof')
	        }

	        read();
	    },

	    value () {
	        switch (c) {
	        case '{':
	        case '[':
	            return newToken('punctuator', read())

	        case 'n':
	            read();
	            literal('ull');
	            return newToken('null', null)

	        case 't':
	            read();
	            literal('rue');
	            return newToken('boolean', true)

	        case 'f':
	            read();
	            literal('alse');
	            return newToken('boolean', false)

	        case '-':
	        case '+':
	            if (read() === '-') {
	                sign = -1;
	            }

	            lexState = 'sign';
	            return

	        case '.':
	            buffer = read();
	            lexState = 'decimalPointLeading';
	            return

	        case '0':
	            buffer = read();
	            lexState = 'zero';
	            return

	        case '1':
	        case '2':
	        case '3':
	        case '4':
	        case '5':
	        case '6':
	        case '7':
	        case '8':
	        case '9':
	            buffer = read();
	            lexState = 'decimalInteger';
	            return

	        case 'I':
	            read();
	            literal('nfinity');
	            return newToken('numeric', Infinity)

	        case 'N':
	            read();
	            literal('aN');
	            return newToken('numeric', NaN)

	        case '"':
	        case "'":
	            doubleQuote = (read() === '"');
	            buffer = '';
	            lexState = 'string';
	            return
	        }

	        throw invalidChar(read())
	    },

	    identifierNameStartEscape () {
	        if (c !== 'u') {
	            throw invalidChar(read())
	        }

	        read();
	        const u = unicodeEscape();
	        switch (u) {
	        case '$':
	        case '_':
	            break

	        default:
	            if (!util.isIdStartChar(u)) {
	                throw invalidIdentifier()
	            }

	            break
	        }

	        buffer += u;
	        lexState = 'identifierName';
	    },

	    identifierName () {
	        switch (c) {
	        case '$':
	        case '_':
	        case '\u200C':
	        case '\u200D':
	            buffer += read();
	            return

	        case '\\':
	            read();
	            lexState = 'identifierNameEscape';
	            return
	        }

	        if (util.isIdContinueChar(c)) {
	            buffer += read();
	            return
	        }

	        return newToken('identifier', buffer)
	    },

	    identifierNameEscape () {
	        if (c !== 'u') {
	            throw invalidChar(read())
	        }

	        read();
	        const u = unicodeEscape();
	        switch (u) {
	        case '$':
	        case '_':
	        case '\u200C':
	        case '\u200D':
	            break

	        default:
	            if (!util.isIdContinueChar(u)) {
	                throw invalidIdentifier()
	            }

	            break
	        }

	        buffer += u;
	        lexState = 'identifierName';
	    },

	    sign () {
	        switch (c) {
	        case '.':
	            buffer = read();
	            lexState = 'decimalPointLeading';
	            return

	        case '0':
	            buffer = read();
	            lexState = 'zero';
	            return

	        case '1':
	        case '2':
	        case '3':
	        case '4':
	        case '5':
	        case '6':
	        case '7':
	        case '8':
	        case '9':
	            buffer = read();
	            lexState = 'decimalInteger';
	            return

	        case 'I':
	            read();
	            literal('nfinity');
	            return newToken('numeric', sign * Infinity)

	        case 'N':
	            read();
	            literal('aN');
	            return newToken('numeric', NaN)
	        }

	        throw invalidChar(read())
	    },

	    zero () {
	        switch (c) {
	        case '.':
	            buffer += read();
	            lexState = 'decimalPoint';
	            return

	        case 'e':
	        case 'E':
	            buffer += read();
	            lexState = 'decimalExponent';
	            return

	        case 'x':
	        case 'X':
	            buffer += read();
	            lexState = 'hexadecimal';
	            return
	        }

	        return newToken('numeric', sign * 0)
	    },

	    decimalInteger () {
	        switch (c) {
	        case '.':
	            buffer += read();
	            lexState = 'decimalPoint';
	            return

	        case 'e':
	        case 'E':
	            buffer += read();
	            lexState = 'decimalExponent';
	            return
	        }

	        if (util.isDigit(c)) {
	            buffer += read();
	            return
	        }

	        return newToken('numeric', sign * Number(buffer))
	    },

	    decimalPointLeading () {
	        if (util.isDigit(c)) {
	            buffer += read();
	            lexState = 'decimalFraction';
	            return
	        }

	        throw invalidChar(read())
	    },

	    decimalPoint () {
	        switch (c) {
	        case 'e':
	        case 'E':
	            buffer += read();
	            lexState = 'decimalExponent';
	            return
	        }

	        if (util.isDigit(c)) {
	            buffer += read();
	            lexState = 'decimalFraction';
	            return
	        }

	        return newToken('numeric', sign * Number(buffer))
	    },

	    decimalFraction () {
	        switch (c) {
	        case 'e':
	        case 'E':
	            buffer += read();
	            lexState = 'decimalExponent';
	            return
	        }

	        if (util.isDigit(c)) {
	            buffer += read();
	            return
	        }

	        return newToken('numeric', sign * Number(buffer))
	    },

	    decimalExponent () {
	        switch (c) {
	        case '+':
	        case '-':
	            buffer += read();
	            lexState = 'decimalExponentSign';
	            return
	        }

	        if (util.isDigit(c)) {
	            buffer += read();
	            lexState = 'decimalExponentInteger';
	            return
	        }

	        throw invalidChar(read())
	    },

	    decimalExponentSign () {
	        if (util.isDigit(c)) {
	            buffer += read();
	            lexState = 'decimalExponentInteger';
	            return
	        }

	        throw invalidChar(read())
	    },

	    decimalExponentInteger () {
	        if (util.isDigit(c)) {
	            buffer += read();
	            return
	        }

	        return newToken('numeric', sign * Number(buffer))
	    },

	    hexadecimal () {
	        if (util.isHexDigit(c)) {
	            buffer += read();
	            lexState = 'hexadecimalInteger';
	            return
	        }

	        throw invalidChar(read())
	    },

	    hexadecimalInteger () {
	        if (util.isHexDigit(c)) {
	            buffer += read();
	            return
	        }

	        return newToken('numeric', sign * Number(buffer))
	    },

	    string () {
	        switch (c) {
	        case '\\':
	            read();
	            buffer += escape();
	            return

	        case '"':
	            if (doubleQuote) {
	                read();
	                return newToken('string', buffer)
	            }

	            buffer += read();
	            return

	        case "'":
	            if (!doubleQuote) {
	                read();
	                return newToken('string', buffer)
	            }

	            buffer += read();
	            return

	        case '\n':
	        case '\r':
	            throw invalidChar(read())

	        case '\u2028':
	        case '\u2029':
	            separatorChar(c);
	            break

	        case undefined:
	            throw invalidChar(read())
	        }

	        buffer += read();
	    },

	    start () {
	        switch (c) {
	        case '{':
	        case '[':
	            return newToken('punctuator', read())

	        // This code is unreachable since the default lexState handles eof.
	        // case undefined:
	        //     return newToken('eof')
	        }

	        lexState = 'value';
	    },

	    beforePropertyName () {
	        switch (c) {
	        case '$':
	        case '_':
	            buffer = read();
	            lexState = 'identifierName';
	            return

	        case '\\':
	            read();
	            lexState = 'identifierNameStartEscape';
	            return

	        case '}':
	            return newToken('punctuator', read())

	        case '"':
	        case "'":
	            doubleQuote = (read() === '"');
	            lexState = 'string';
	            return
	        }

	        if (util.isIdStartChar(c)) {
	            buffer += read();
	            lexState = 'identifierName';
	            return
	        }

	        throw invalidChar(read())
	    },

	    afterPropertyName () {
	        if (c === ':') {
	            return newToken('punctuator', read())
	        }

	        throw invalidChar(read())
	    },

	    beforePropertyValue () {
	        lexState = 'value';
	    },

	    afterPropertyValue () {
	        switch (c) {
	        case ',':
	        case '}':
	            return newToken('punctuator', read())
	        }

	        throw invalidChar(read())
	    },

	    beforeArrayValue () {
	        if (c === ']') {
	            return newToken('punctuator', read())
	        }

	        lexState = 'value';
	    },

	    afterArrayValue () {
	        switch (c) {
	        case ',':
	        case ']':
	            return newToken('punctuator', read())
	        }

	        throw invalidChar(read())
	    },

	    end () {
	        // This code is unreachable since it's handled by the default lexState.
	        // if (c === undefined) {
	        //     read()
	        //     return newToken('eof')
	        // }

	        throw invalidChar(read())
	    },
	};

	function newToken (type, value) {
	    return {
	        type,
	        value,
	        line,
	        column,
	    }
	}

	function literal (s) {
	    for (const c of s) {
	        const p = peek();

	        if (p !== c) {
	            throw invalidChar(read())
	        }

	        read();
	    }
	}

	function escape () {
	    const c = peek();
	    switch (c) {
	    case 'b':
	        read();
	        return '\b'

	    case 'f':
	        read();
	        return '\f'

	    case 'n':
	        read();
	        return '\n'

	    case 'r':
	        read();
	        return '\r'

	    case 't':
	        read();
	        return '\t'

	    case 'v':
	        read();
	        return '\v'

	    case '0':
	        read();
	        if (util.isDigit(peek())) {
	            throw invalidChar(read())
	        }

	        return '\0'

	    case 'x':
	        read();
	        return hexEscape()

	    case 'u':
	        read();
	        return unicodeEscape()

	    case '\n':
	    case '\u2028':
	    case '\u2029':
	        read();
	        return ''

	    case '\r':
	        read();
	        if (peek() === '\n') {
	            read();
	        }

	        return ''

	    case '1':
	    case '2':
	    case '3':
	    case '4':
	    case '5':
	    case '6':
	    case '7':
	    case '8':
	    case '9':
	        throw invalidChar(read())

	    case undefined:
	        throw invalidChar(read())
	    }

	    return read()
	}

	function hexEscape () {
	    let buffer = '';
	    let c = peek();

	    if (!util.isHexDigit(c)) {
	        throw invalidChar(read())
	    }

	    buffer += read();

	    c = peek();
	    if (!util.isHexDigit(c)) {
	        throw invalidChar(read())
	    }

	    buffer += read();

	    return String.fromCodePoint(parseInt(buffer, 16))
	}

	function unicodeEscape () {
	    let buffer = '';
	    let count = 4;

	    while (count-- > 0) {
	        const c = peek();
	        if (!util.isHexDigit(c)) {
	            throw invalidChar(read())
	        }

	        buffer += read();
	    }

	    return String.fromCodePoint(parseInt(buffer, 16))
	}

	const parseStates = {
	    start () {
	        if (token.type === 'eof') {
	            throw invalidEOF()
	        }

	        push();
	    },

	    beforePropertyName () {
	        switch (token.type) {
	        case 'identifier':
	        case 'string':
	            key = token.value;
	            parseState = 'afterPropertyName';
	            return

	        case 'punctuator':
	            // This code is unreachable since it's handled by the lexState.
	            // if (token.value !== '}') {
	            //     throw invalidToken()
	            // }

	            pop();
	            return

	        case 'eof':
	            throw invalidEOF()
	        }

	        // This code is unreachable since it's handled by the lexState.
	        // throw invalidToken()
	    },

	    afterPropertyName () {
	        // This code is unreachable since it's handled by the lexState.
	        // if (token.type !== 'punctuator' || token.value !== ':') {
	        //     throw invalidToken()
	        // }

	        if (token.type === 'eof') {
	            throw invalidEOF()
	        }

	        parseState = 'beforePropertyValue';
	    },

	    beforePropertyValue () {
	        if (token.type === 'eof') {
	            throw invalidEOF()
	        }

	        push();
	    },

	    beforeArrayValue () {
	        if (token.type === 'eof') {
	            throw invalidEOF()
	        }

	        if (token.type === 'punctuator' && token.value === ']') {
	            pop();
	            return
	        }

	        push();
	    },

	    afterPropertyValue () {
	        // This code is unreachable since it's handled by the lexState.
	        // if (token.type !== 'punctuator') {
	        //     throw invalidToken()
	        // }

	        if (token.type === 'eof') {
	            throw invalidEOF()
	        }

	        switch (token.value) {
	        case ',':
	            parseState = 'beforePropertyName';
	            return

	        case '}':
	            pop();
	        }

	        // This code is unreachable since it's handled by the lexState.
	        // throw invalidToken()
	    },

	    afterArrayValue () {
	        // This code is unreachable since it's handled by the lexState.
	        // if (token.type !== 'punctuator') {
	        //     throw invalidToken()
	        // }

	        if (token.type === 'eof') {
	            throw invalidEOF()
	        }

	        switch (token.value) {
	        case ',':
	            parseState = 'beforeArrayValue';
	            return

	        case ']':
	            pop();
	        }

	        // This code is unreachable since it's handled by the lexState.
	        // throw invalidToken()
	    },

	    end () {
	        // This code is unreachable since it's handled by the lexState.
	        // if (token.type !== 'eof') {
	        //     throw invalidToken()
	        // }
	    },
	};

	function push () {
	    let value;

	    switch (token.type) {
	    case 'punctuator':
	        switch (token.value) {
	        case '{':
	            value = {};
	            break

	        case '[':
	            value = [];
	            break
	        }

	        break

	    case 'null':
	    case 'boolean':
	    case 'numeric':
	    case 'string':
	        value = token.value;
	        break

	    // This code is unreachable.
	    // default:
	    //     throw invalidToken()
	    }

	    if (root === undefined) {
	        root = value;
	    } else {
	        const parent = stack[stack.length - 1];
	        if (Array.isArray(parent)) {
	            parent.push(value);
	        } else {
	            Object.defineProperty(parent, key, {
	                value,
	                writable: true,
	                enumerable: true,
	                configurable: true,
	            });
	        }
	    }

	    if (value !== null && typeof value === 'object') {
	        stack.push(value);

	        if (Array.isArray(value)) {
	            parseState = 'beforeArrayValue';
	        } else {
	            parseState = 'beforePropertyName';
	        }
	    } else {
	        const current = stack[stack.length - 1];
	        if (current == null) {
	            parseState = 'end';
	        } else if (Array.isArray(current)) {
	            parseState = 'afterArrayValue';
	        } else {
	            parseState = 'afterPropertyValue';
	        }
	    }
	}

	function pop () {
	    stack.pop();

	    const current = stack[stack.length - 1];
	    if (current == null) {
	        parseState = 'end';
	    } else if (Array.isArray(current)) {
	        parseState = 'afterArrayValue';
	    } else {
	        parseState = 'afterPropertyValue';
	    }
	}

	// This code is unreachable.
	// function invalidParseState () {
	//     return new Error(`JSON5: invalid parse state '${parseState}'`)
	// }

	// This code is unreachable.
	// function invalidLexState (state) {
	//     return new Error(`JSON5: invalid lex state '${state}'`)
	// }

	function invalidChar (c) {
	    if (c === undefined) {
	        return syntaxError(`JSON5: invalid end of input at ${line}:${column}`)
	    }

	    return syntaxError(`JSON5: invalid character '${formatChar(c)}' at ${line}:${column}`)
	}

	function invalidEOF () {
	    return syntaxError(`JSON5: invalid end of input at ${line}:${column}`)
	}

	// This code is unreachable.
	// function invalidToken () {
	//     if (token.type === 'eof') {
	//         return syntaxError(`JSON5: invalid end of input at ${line}:${column}`)
	//     }

	//     const c = String.fromCodePoint(token.value.codePointAt(0))
	//     return syntaxError(`JSON5: invalid character '${formatChar(c)}' at ${line}:${column}`)
	// }

	function invalidIdentifier () {
	    column -= 5;
	    return syntaxError(`JSON5: invalid identifier character at ${line}:${column}`)
	}

	function separatorChar (c) {
	    console.warn(`JSON5: '${formatChar(c)}' in strings is not valid ECMAScript; consider escaping`);
	}

	function formatChar (c) {
	    const replacements = {
	        "'": "\\'",
	        '"': '\\"',
	        '\\': '\\\\',
	        '\b': '\\b',
	        '\f': '\\f',
	        '\n': '\\n',
	        '\r': '\\r',
	        '\t': '\\t',
	        '\v': '\\v',
	        '\0': '\\0',
	        '\u2028': '\\u2028',
	        '\u2029': '\\u2029',
	    };

	    if (replacements[c]) {
	        return replacements[c]
	    }

	    if (c < ' ') {
	        const hexString = c.charCodeAt(0).toString(16);
	        return '\\x' + ('00' + hexString).substring(hexString.length)
	    }

	    return c
	}

	function syntaxError (message) {
	    const err = new SyntaxError(message);
	    err.lineNumber = line;
	    err.columnNumber = column;
	    return err
	}

	var stringify = function stringify (value, replacer, space) {
	    const stack = [];
	    let indent = '';
	    let propertyList;
	    let replacerFunc;
	    let gap = '';
	    let quote;

	    if (
	        replacer != null &&
	        typeof replacer === 'object' &&
	        !Array.isArray(replacer)
	    ) {
	        space = replacer.space;
	        quote = replacer.quote;
	        replacer = replacer.replacer;
	    }

	    if (typeof replacer === 'function') {
	        replacerFunc = replacer;
	    } else if (Array.isArray(replacer)) {
	        propertyList = [];
	        for (const v of replacer) {
	            let item;

	            if (typeof v === 'string') {
	                item = v;
	            } else if (
	                typeof v === 'number' ||
	                v instanceof String ||
	                v instanceof Number
	            ) {
	                item = String(v);
	            }

	            if (item !== undefined && propertyList.indexOf(item) < 0) {
	                propertyList.push(item);
	            }
	        }
	    }

	    if (space instanceof Number) {
	        space = Number(space);
	    } else if (space instanceof String) {
	        space = String(space);
	    }

	    if (typeof space === 'number') {
	        if (space > 0) {
	            space = Math.min(10, Math.floor(space));
	            gap = '          '.substr(0, space);
	        }
	    } else if (typeof space === 'string') {
	        gap = space.substr(0, 10);
	    }

	    return serializeProperty('', {'': value})

	    function serializeProperty (key, holder) {
	        let value = holder[key];
	        if (value != null) {
	            if (typeof value.toJSON5 === 'function') {
	                value = value.toJSON5(key);
	            } else if (typeof value.toJSON === 'function') {
	                value = value.toJSON(key);
	            }
	        }

	        if (replacerFunc) {
	            value = replacerFunc.call(holder, key, value);
	        }

	        if (value instanceof Number) {
	            value = Number(value);
	        } else if (value instanceof String) {
	            value = String(value);
	        } else if (value instanceof Boolean) {
	            value = value.valueOf();
	        }

	        switch (value) {
	        case null: return 'null'
	        case true: return 'true'
	        case false: return 'false'
	        }

	        if (typeof value === 'string') {
	            return quoteString(value)
	        }

	        if (typeof value === 'number') {
	            return String(value)
	        }

	        if (typeof value === 'object') {
	            return Array.isArray(value) ? serializeArray(value) : serializeObject(value)
	        }

	        return undefined
	    }

	    function quoteString (value) {
	        const quotes = {
	            "'": 0.1,
	            '"': 0.2,
	        };

	        const replacements = {
	            "'": "\\'",
	            '"': '\\"',
	            '\\': '\\\\',
	            '\b': '\\b',
	            '\f': '\\f',
	            '\n': '\\n',
	            '\r': '\\r',
	            '\t': '\\t',
	            '\v': '\\v',
	            '\0': '\\0',
	            '\u2028': '\\u2028',
	            '\u2029': '\\u2029',
	        };

	        let product = '';

	        for (let i = 0; i < value.length; i++) {
	            const c = value[i];
	            switch (c) {
	            case "'":
	            case '"':
	                quotes[c]++;
	                product += c;
	                continue

	            case '\0':
	                if (util.isDigit(value[i + 1])) {
	                    product += '\\x00';
	                    continue
	                }
	            }

	            if (replacements[c]) {
	                product += replacements[c];
	                continue
	            }

	            if (c < ' ') {
	                let hexString = c.charCodeAt(0).toString(16);
	                product += '\\x' + ('00' + hexString).substring(hexString.length);
	                continue
	            }

	            product += c;
	        }

	        const quoteChar = quote || Object.keys(quotes).reduce((a, b) => (quotes[a] < quotes[b]) ? a : b);

	        product = product.replace(new RegExp(quoteChar, 'g'), replacements[quoteChar]);

	        return quoteChar + product + quoteChar
	    }

	    function serializeObject (value) {
	        if (stack.indexOf(value) >= 0) {
	            throw TypeError('Converting circular structure to JSON5')
	        }

	        stack.push(value);

	        let stepback = indent;
	        indent = indent + gap;

	        let keys = propertyList || Object.keys(value);
	        let partial = [];
	        for (const key of keys) {
	            const propertyString = serializeProperty(key, value);
	            if (propertyString !== undefined) {
	                let member = serializeKey(key) + ':';
	                if (gap !== '') {
	                    member += ' ';
	                }
	                member += propertyString;
	                partial.push(member);
	            }
	        }

	        let final;
	        if (partial.length === 0) {
	            final = '{}';
	        } else {
	            let properties;
	            if (gap === '') {
	                properties = partial.join(',');
	                final = '{' + properties + '}';
	            } else {
	                let separator = ',\n' + indent;
	                properties = partial.join(separator);
	                final = '{\n' + indent + properties + ',\n' + stepback + '}';
	            }
	        }

	        stack.pop();
	        indent = stepback;
	        return final
	    }

	    function serializeKey (key) {
	        if (key.length === 0) {
	            return quoteString(key)
	        }

	        const firstChar = String.fromCodePoint(key.codePointAt(0));
	        if (!util.isIdStartChar(firstChar)) {
	            return quoteString(key)
	        }

	        for (let i = firstChar.length; i < key.length; i++) {
	            if (!util.isIdContinueChar(String.fromCodePoint(key.codePointAt(i)))) {
	                return quoteString(key)
	            }
	        }

	        return key
	    }

	    function serializeArray (value) {
	        if (stack.indexOf(value) >= 0) {
	            throw TypeError('Converting circular structure to JSON5')
	        }

	        stack.push(value);

	        let stepback = indent;
	        indent = indent + gap;

	        let partial = [];
	        for (let i = 0; i < value.length; i++) {
	            const propertyString = serializeProperty(String(i), value);
	            partial.push((propertyString !== undefined) ? propertyString : 'null');
	        }

	        let final;
	        if (partial.length === 0) {
	            final = '[]';
	        } else {
	            if (gap === '') {
	                let properties = partial.join(',');
	                final = '[' + properties + ']';
	            } else {
	                let separator = ',\n' + indent;
	                let properties = partial.join(separator);
	                final = '[\n' + indent + properties + ',\n' + stepback + ']';
	            }
	        }

	        stack.pop();
	        indent = stepback;
	        return final
	    }
	};

	const JSON5 = {
	    parse,
	    stringify,
	};

	var lib$2 = JSON5;

	var dist = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: lib$2
	});

	var require$$0$1 = /*@__PURE__*/getAugmentedNamespace(dist);

	var hasRequiredParser;

	function requireParser () {
		if (hasRequiredParser) return parser.exports;
		hasRequiredParser = 1;
		(function (module) {
			// External libraries are lazy-loaded only if these file types exist.

			// webpack can't solve dynamic module
			// @see https://github.com/node-config/node-config/issues/755
			// @see https://webpack.js.org/guides/dependency-management/#require-with-expression
			const JSON5Module = require$$0$1;

			// webpack resolves json5 with module field out of the box which lead to this usage
			// @see https://github.com/node-config/node-config/issues/755
			// @see https://github.com/json5/json5/issues/240
			const JSON5 = JSON5Module.default || JSON5Module;

			var Yaml = null,
			    VisionmediaYaml = null,
			    Coffee = null,
			    Iced = null,
			    CSON = null,
			    PPARSER = null,
			    TOML = null,
			    HJSON = null,
			    XML = null;

			// Define soft dependencies so transpilers don't include everything
			var COFFEE_2_DEP = 'coffeescript',
			    COFFEE_DEP = 'coffee-script',
			    ICED_DEP = 'iced-coffee-script',
			    JS_YAML_DEP = 'js-yaml',
			    YAML_DEP = 'yaml',
			    HJSON_DEP = 'hjson',
			    TOML_DEP = 'toml',
			    CSON_DEP = 'cson',
			    PPARSER_DEP = 'properties',
			    XML_DEP = 'x2js',
			    TS_DEP = 'ts-node';

			var Parser = module.exports;

			Parser.parse = function(filename, content) {
			  var parserName = filename.substr(filename.lastIndexOf('.') +1);  // file extension
			  if (typeof definitions[parserName] === 'function') {
			    return definitions[parserName](filename, content);
			  }
			  // TODO: decide what to do in case of a missing parser
			};

			Parser.xmlParser = function(filename, content) {
			  if (!XML) {
			    XML = commonjsRequire(XML_DEP);
			  }
			  var x2js = new XML();
			  var configObject = x2js.xml2js(content);
			  var rootKeys = Object.keys(configObject);
			  if(rootKeys.length === 1) {
			    return configObject[rootKeys[0]];
			  }
			  return configObject;
			};

			Parser.jsParser = function(filename, content) {
			  var configObject = commonjsRequire(filename);

			  if (configObject.__esModule && isObject(configObject.default)) {
			    return configObject.default
			  }
			  return configObject;
			};

			Parser.tsParser = function(filename, content) {
			  if (!commonjsRequire.extensions['.ts']) {
			    commonjsRequire(TS_DEP).register({
			      lazy: true,
			      ignore: ['(?:^|/)node_modules/', '.*(?<!\.ts)$'],
			      transpileOnly: true,
			      compilerOptions: {
			        allowJs: true,
			      }
			    });
			  }

			  // Imports config if it is exported via module.exports = ...
			  // See https://github.com/node-config/node-config/issues/524
			  var configObject = commonjsRequire(filename);

			  // Because of ES6 modules usage, `default` is treated as named export (like any other)
			  // Therefore config is a value of `default` key.
			  if (configObject.default) {
			    return configObject.default
			  }
			  return configObject;
			};

			Parser.coffeeParser = function(filename, content) {
			  // .coffee files can be loaded with either coffee-script or iced-coffee-script.
			  // Prefer iced-coffee-script, if it exists.
			  // Lazy load the appropriate extension
			  if (!Coffee) {
			    Coffee = {};

			    // The following enables iced-coffee-script on .coffee files, if iced-coffee-script is available.
			    // This is commented as per a decision on a pull request.
			    //try {
			    //  Coffee = require('iced-coffee-script');
			    //}
			    //catch (e) {
			    //  Coffee = require('coffee-script');
			    //}
			    try {
			      // Try to load coffeescript
			      Coffee = commonjsRequire(COFFEE_2_DEP);
			    }
			    catch (e) {
			      // If it doesn't exist, try to load it using the deprecated module name
			      Coffee = commonjsRequire(COFFEE_DEP);
			    }
			    // coffee-script >= 1.7.0 requires explicit registration for require() to work
			    if (Coffee.register) {
			      Coffee.register();
			    }
			  }
			  // Use the built-in parser for .coffee files with coffee-script
			  return commonjsRequire(filename);
			};

			Parser.icedParser = function(filename, content) {
			  Iced = commonjsRequire(ICED_DEP);

			  // coffee-script >= 1.7.0 requires explicit registration for require() to work
			  if (Iced.register) {
			    Iced.register();
			  }
			};

			Parser.yamlParser = function(filename, content) {
			  if (!Yaml && !VisionmediaYaml) {
			    // Lazy loading
			    try {
			      // Try to load the better js-yaml module
			      Yaml = commonjsRequire(JS_YAML_DEP);
			    }
			    catch (e) {
			      try {
			        // If it doesn't exist, load the fallback visionmedia yaml module.
			        VisionmediaYaml = commonjsRequire(YAML_DEP);
			      }
			      catch (e) { }
			    }
			  }
			  if (Yaml) {
			    return Yaml.load(content);
			  }
			  else if (VisionmediaYaml) {
			    // The yaml library doesn't like strings that have newlines but don't
			    // end in a newline: https://github.com/visionmedia/js-yaml/issues/issue/13
			    content += '\n';
			    if (typeof VisionmediaYaml.eval === 'function') {
			      return VisionmediaYaml.eval(Parser.stripYamlComments(content));
			    }
			    return VisionmediaYaml.parse(Parser.stripYamlComments(content));
			  }
			  else {
			    console.error('No YAML parser loaded.  Suggest adding js-yaml dependency to your package.json file.');
			  }
			};

			Parser.jsonParser = function(filename, content) {
			  /**
			   * Default JSON parsing to JSON5 parser.
			   * This is due to issues with removing supported comments.
			   * More information can be found here: https://github.com/node-config/node-config/issues/715
			   */
			  return JSON5.parse(content);
			};

			Parser.json5Parser = function(filename, content) {
			  return JSON5.parse(content);
			};

			Parser.hjsonParser = function(filename, content) {
			  if (!HJSON) {
			    HJSON = commonjsRequire(HJSON_DEP);
			  }
			  return HJSON.parse(content);
			};

			Parser.tomlParser = function(filename, content) {
			  if(!TOML) {
			    TOML = commonjsRequire(TOML_DEP);
			  }
			  return TOML.parse(content);
			};

			Parser.csonParser = function(filename, content) {
			  if (!CSON) {
			    CSON = commonjsRequire(CSON_DEP);
			  }
			  // Allow comments in CSON files
			  if (typeof CSON.parseSync === 'function') {
			    return CSON.parseSync(content);
			  }
			  return CSON.parse(content);
			};

			Parser.propertiesParser = function(filename, content) {
			  if (!PPARSER) {
			    PPARSER = commonjsRequire(PPARSER_DEP);
			  }
			  return PPARSER.parse(content, { namespaces: true, variables: true, sections: true });
			};

			/**
			 * Strip all Javascript type comments from the string.
			 *
			 * The string is usually a file loaded from the O/S, containing
			 * newlines and javascript type comments.
			 *
			 * Thanks to James Padolsey, and all who contributed to this implementation.
			 * http://james.padolsey.com/javascript/javascript-comment-removal-revisted/
			 *
			 * @protected
			 * @method stripComments
			 * @param fileStr {string} The string to strip comments from
			 * @param stringRegex {RegExp} Optional regular expression to match strings that
			 *   make up the config file
			 * @return {string} The string with comments stripped.
			 */
			Parser.stripComments = function(fileStr, stringRegex) {
			  stringRegex = stringRegex || /"((?:[^"\\]|\\.)*)"/g;

			  var uid = '_' + +new Date(),
			    primitives = [],
			    primIndex = 0;

			  return (
			    fileStr

			    /* Remove strings */
			      .replace(stringRegex, function(match){
			        primitives[primIndex] = match;
			        return (uid + '') + primIndex++;
			      })

			      /* Remove Regexes */
			      .replace(/([^\/])(\/(?!\*|\/)(\\\/|.)+?\/[gim]{0,3})/g, function(match, $1, $2){
			        primitives[primIndex] = $2;
			        return $1 + (uid + '') + primIndex++;
			      })

			      /*
			      - Remove single-line comments that contain would-be multi-line delimiters
			          E.g. // Comment /* <--
			      - Remove multi-line comments that contain would be single-line delimiters
			          E.g. /* // <--
			     */
			      .replace(/\/\/.*?\/?\*.+?(?=\n|\r|$)|\/\*[\s\S]*?\/\/[\s\S]*?\*\//g, '')

			      /*
			      Remove single and multi-line comments,
			      no consideration of inner-contents
			     */
			      .replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g, '')

			      /*
			      Remove multi-line comments that have a replaced ending (string/regex)
			      Greedy, so no inner strings/regexes will stop it.
			     */
			      .replace(RegExp('\\/\\*[\\s\\S]+' + uid + '\\d+', 'g'), '')

			      /* Bring back strings & regexes */
			      .replace(RegExp(uid + '(\\d+)', 'g'), function(match, n){
			        return primitives[n];
			      })
			  );

			};

			/**
			 * Strip YAML comments from the string
			 *
			 * The 2.0 yaml parser doesn't allow comment-only or blank lines.  Strip them.
			 *
			 * @protected
			 * @method stripYamlComments
			 * @param fileStr {string} The string to strip comments from
			 * @return {string} The string with comments stripped.
			 */
			Parser.stripYamlComments = function(fileStr) {
			  // First replace removes comment-only lines
			  // Second replace removes blank lines
			  return fileStr.replace(/^\s*#.*/mg,'').replace(/^\s*[\n|\r]+/mg,'');
			};

			/**
			 * Parses the environment variable to the boolean equivalent.
			 * Defaults to false
			 *
			 * @param {String} content - Environment variable value
			 * @return {boolean} - Boolean value fo the passed variable value
			 */
			Parser.booleanParser = function(filename, content) {
			  return content === 'true';
			};

			/**
			 * Parses the environment variable to the number equivalent.
			 * Defaults to undefined
			 *
			 * @param {String} content - Environment variable value
			 * @return {Number} - Number value fo the passed variable value
			 */
			Parser.numberParser = function(filename, content) {
			  const numberValue = Number(content);
			  return Number.isNaN(numberValue) ? undefined : numberValue;
			};

			var order = ['js', 'cjs', 'ts', 'json', 'json5', 'hjson', 'toml', 'coffee', 'iced', 'yaml', 'yml', 'cson', 'properties', 'xml',
			  'boolean', 'number'];
			var definitions = {
			  cjs: Parser.jsParser,
			  coffee: Parser.coffeeParser,
			  cson: Parser.csonParser,
			  hjson: Parser.hjsonParser,
			  iced: Parser.icedParser,
			  js: Parser.jsParser,
			  json: Parser.jsonParser,
			  json5: Parser.json5Parser,
			  properties: Parser.propertiesParser,
			  toml: Parser.tomlParser,
			  ts: Parser.tsParser,
			  xml: Parser.xmlParser,
			  yaml: Parser.yamlParser,
			  yml: Parser.yamlParser,
			  boolean: Parser.booleanParser,
			  number: Parser.numberParser
			};

			Parser.getParser = function(name) {
			  return definitions[name];
			};

			Parser.setParser = function(name, parser) {
			  definitions[name] = parser;
			  if (order.indexOf(name) === -1) {
			    order.push(name);
			  }
			};

			Parser.getFilesOrder = function(name) {
			  if (name) {
			    return order.indexOf(name);
			  }
			  return order;
			};

			Parser.setFilesOrder = function(name, newIndex) {
			  if (Array.isArray(name)) {
			    return order = name;
			  }
			  if (typeof newIndex === 'number') {
			    var index = order.indexOf(name);
			    order.splice(newIndex, 0, name);
			    if (index > -1) {
			      order.splice(index >= newIndex ? index +1 : index, 1);
			    }
			  }
			  return order;
			};

			function isObject(arg) {
			  return (arg !== null) && (typeof arg === 'object');
			} 
		} (parser));
		return parser.exports;
	}

	var hasRequiredConfig$1;

	function requireConfig$1 () {
		if (hasRequiredConfig$1) return config$1.exports;
		hasRequiredConfig$1 = 1;
		// config.js (c) 2010-2022 Loren West and other contributors
		// May be freely distributed under the MIT license.
		// For further details and documentation:
		// http://lorenwest.github.com/node-config

		// Dependencies
		const DeferredConfig = requireDefer().DeferredConfig;
		const RawConfig = requireRaw().RawConfig;
		let Parser = requireParser();
		const Path = require$$1;
		const FileSystem = require$$0$2;

		// Static members
		const DEFAULT_CLONE_DEPTH = 20;
		let CONFIG_DIR;
		let NODE_ENV;
		let APP_INSTANCE;
		let CONFIG_SKIP_GITCRYPT;
		let NODE_ENV_VAR_NAME;
		let NODE_CONFIG_PARSER;
		const env = {};
		const configSources = [];          // Configuration sources - array of {name, original, parsed}
		let checkMutability = true;      // Check for mutability/immutability on first get
		const gitCryptTestRegex = /^.GITCRYPT/; // regular expression to test for gitcrypt files.

		/**
		 * <p>Application Configurations</p>
		 *
		 * <p>
		 * The config module exports a singleton object representing all
		 * configurations for this application deployment.
		 * </p>
		 *
		 * <p>
		 * Application configurations are stored in files within the config directory
		 * of your application.  The default configuration file is loaded, followed
		 * by files specific to the deployment type (development, testing, staging,
		 * production, etc.).
		 * </p>
		 *
		 * <p>
		 * For example, with the following config/default.yaml file:
		 * </p>
		 *
		 * <pre>
		 *   ...
		 *   customer:
		 *     &nbsp;&nbsp;initialCredit: 500
		 *     &nbsp;&nbsp;db:
		 *       &nbsp;&nbsp;&nbsp;&nbsp;name: customer
		 *       &nbsp;&nbsp;&nbsp;&nbsp;port: 5984
		 *   ...
		 * </pre>
		 *
		 * <p>
		 * The following code loads the customer section into the CONFIG variable:
		 * <p>
		 *
		 * <pre>
		 *   const CONFIG = require('config').customer;
		 *   ...
		 *   newCustomer.creditLimit = CONFIG.initialCredit;
		 *   database.open(CONFIG.db.name, CONFIG.db.port);
		 *   ...
		 * </pre>
		 *
		 * @module config
		 * @class Config
		 */

		/**
		 * <p>Get the configuration object.</p>
		 *
		 * <p>
		 * The configuration object is a shared singleton object within the application,
		 * attained by calling require('config').
		 * </p>
		 *
		 * <p>
		 * Usually you'll specify a CONFIG variable at the top of your .js file
		 * for file/module scope. If you want the root of the object, you can do this:
		 * </p>
		 * <pre>
		 * const CONFIG = require('config');
		 * </pre>
		 *
		 * <p>
		 * Sometimes you only care about a specific sub-object within the CONFIG
		 * object.  In that case you could do this at the top of your file:
		 * </p>
		 * <pre>
		 * const CONFIG = require('config').customer;
		 * or
		 * const CUSTOMER_CONFIG = require('config').customer;
		 * </pre>
		 *
		 * <script type="text/javascript">
		 *   document.getElementById("showProtected").style.display = "block";
		 * </script>
		 *
		 * @method constructor
		 * @return CONFIG {object} - The top level configuration object
		 */
		const Config = function() {
		  const t = this;

		  // Bind all utility functions to this
		  for (const fnName in util) {
		    if (typeof util[fnName] === 'function') {
		      util[fnName] = util[fnName].bind(t);
		    }
		  }

		  // Merge configurations into this
		  util.extendDeep(t, util.loadFileConfigs());
		  util.attachProtoDeep(t);

		  // Perform strictness checks and possibly throw an exception.
		  util.runStrictnessChecks(t);
		};

		/**
		 * Utilities are under the util namespace vs. at the top level
		 */
		const util = Config.prototype.util = {};

		/**
		 * Underlying get mechanism
		 *
		 * @private
		 * @method getImpl
		 * @param object {object} - Object to get the property for
		 * @param property {string|string[]} - The property name to get (as an array or '.' delimited string)
		 * @return value {*} - Property value, including undefined if not defined.
		 */
		const getImpl= function(object, property) {
		  const elems = Array.isArray(property) ? property : property.split('.');
		  const name = elems[0];
		  const value = object[name];
		  if (elems.length <= 1) {
		    return value;
		  }
		  // Note that typeof null === 'object'
		  if (value === null || typeof value !== 'object') {
		    return undefined;
		  }
		  return getImpl(value, elems.slice(1));
		};

		/**
		 * <p>Get a configuration value</p>
		 *
		 * <p>
		 * This will return the specified property value, throwing an exception if the
		 * configuration isn't defined.  It is used to assure configurations are defined
		 * before being used, and to prevent typos.
		 * </p>
		 *
		 * @method get
		 * @param property {string} - The configuration property to get. Can include '.' sub-properties.
		 * @return value {*} - The property value
		 */
		Config.prototype.get = function(property) {
		  if(property === null || typeof property === "undefined"){
		    throw new Error("Calling config.get with null or undefined argument");
		  }

		  // Make configurations immutable after first get (unless disabled)
		  if (checkMutability) {
		    if (!util.initParam('ALLOW_CONFIG_MUTATIONS', false)) {
		      util.makeImmutable(config);
		    }
		    checkMutability = false;
		  }
		  const t = this;
		  const value = getImpl(t, property);

		  // Produce an exception if the property doesn't exist
		  if (typeof value === "undefined") {
		    throw new Error('Configuration property "' + property + '" is not defined');
		  }

		  // Return the value
		  return value;
		};

		/**
		 * Test that a configuration parameter exists
		 *
		 * <pre>
		 *    const config = require('config');
		 *    if (config.has('customer.dbName')) {
		 *      console.log('Customer database name: ' + config.customer.dbName);
		 *    }
		 * </pre>
		 *
		 * @method has
		 * @param property {string} - The configuration property to test. Can include '.' sub-properties.
		 * @return isPresent {boolean} - True if the property is defined, false if not defined.
		 */
		Config.prototype.has = function(property) {
		  // While get() throws an exception for undefined input, has() is designed to test validity, so false is appropriate
		  if(property === null || typeof property === "undefined"){
		    return false;
		  }
		  const t = this;
		  return typeof getImpl(t, property) !== "undefined";
		};

		/**
		 * <p>
		 * Set default configurations for a node.js module.
		 * </p>
		 *
		 * <p>
		 * This allows module developers to attach their configurations onto the
		 * default configuration object so they can be configured by the consumers
		 * of the module.
		 * </p>
		 *
		 * <p>Using the function within your module:</p>
		 * <pre>
		 *   const CONFIG = require("config");
		 *   CONFIG.util.setModuleDefaults("MyModule", {
		 *   &nbsp;&nbsp;templateName: "t-50",
		 *   &nbsp;&nbsp;colorScheme: "green"
		 *   });
		 * <br>
		 *   // Template name may be overridden by application config files
		 *   console.log("Template: " + CONFIG.MyModule.templateName);
		 * </pre>
		 *
		 * <p>
		 * The above example results in a "MyModule" element of the configuration
		 * object, containing an object with the specified default values.
		 * </p>
		 *
		 * @method setModuleDefaults
		 * @param moduleName {string} - Name of your module.
		 * @param defaultProperties {object} - The default module configuration.
		 * @return moduleConfig {object} - The module level configuration object.
		 */
		util.setModuleDefaults = function (moduleName, defaultProperties) {

		  // Copy the properties into a new object
		  const t = this;
		  const moduleConfig = util.cloneDeep(defaultProperties);

		  // Set module defaults into the first sources element
		  if (configSources.length === 0 || configSources[0].name !== 'Module Defaults') {
		    configSources.splice(0, 0, {
		      name: 'Module Defaults',
		      parsed: {}
		    });
		  }
		  util.setPath(configSources[0].parsed, moduleName.split('.'), {});
		  util.extendDeep(getImpl(configSources[0].parsed, moduleName), defaultProperties);

		  // Create a top level config for this module if it doesn't exist
		  util.setPath(t, moduleName.split('.'), getImpl(t, moduleName) || {});

		  // Extend local configurations into the module config
		  util.extendDeep(moduleConfig, getImpl(t, moduleName));

		  // Merge the extended configs without replacing the original
		  util.extendDeep(getImpl(t, moduleName), moduleConfig);

		  // reset the mutability check for "config.get" method.
		  // we are not making t[moduleName] immutable immediately,
		  // since there might be more modifications before the first config.get
		  if (!util.initParam('ALLOW_CONFIG_MUTATIONS', false)) {
		    checkMutability = true;
		  }

		  // Attach handlers & watchers onto the module config object
		  return util.attachProtoDeep(getImpl(t, moduleName));
		};

		/**
		 * <p>Make a configuration property hidden so it doesn't appear when enumerating
		 * elements of the object.</p>
		 *
		 * <p>
		 * The property still exists and can be read from and written to, but it won't
		 * show up in for ... in loops, Object.keys(), or JSON.stringify() type methods.
		 * </p>
		 *
		 * <p>
		 * If the property already exists, it will be made hidden.  Otherwise it will
		 * be created as a hidden property with the specified value.
		 * </p>
		 *
		 * <p><i>
		 * This method was built for hiding configuration values, but it can be applied
		 * to <u>any</u> javascript object.
		 * </i></p>
		 *
		 * <p>Example:</p>
		 * <pre>
		 *   const CONFIG = require('config');
		 *   ...
		 *
		 *   // Hide the Amazon S3 credentials
		 *   CONFIG.util.makeHidden(CONFIG.amazonS3, 'access_id');
		 *   CONFIG.util.makeHidden(CONFIG.amazonS3, 'secret_key');
		 * </pre>
		 *
		 * @method makeHidden
		 * @param object {object} - The object to make a hidden property into.
		 * @param property {string} - The name of the property to make hidden.
		 * @param value {*} - (optional) Set the property value to this (otherwise leave alone)
		 * @return object {object} - The original object is returned - for chaining.
		 */
		util.makeHidden = function(object, property, value) {

		  // If the new value isn't specified, just mark the property as hidden
		  if (typeof value === 'undefined') {
		    Object.defineProperty(object, property, {
		      enumerable : false
		    });
		  }
		  // Otherwise set the value and mark it as hidden
		  else {
		    Object.defineProperty(object, property, {
		      value      : value,
		      enumerable : false
		    });
		  }

		  return object;
		};

		/**
		 * <p>Make a javascript object property immutable (assuring it cannot be changed
		 * from the current value).</p>
		 * <p>
		 * If the specified property is an object, all attributes of that object are
		 * made immutable, including properties of contained objects, recursively.
		 * If a property name isn't supplied, all properties of the object are made
		 * immutable.
		 * </p>
		 * <p>
		 *
		 * </p>
		 * <p>
		 * New properties can be added to the object and those properties will not be
		 * immutable unless this method is called on those new properties.
		 * </p>
		 * <p>
		 * This operation cannot be undone.
		 * </p>
		 *
		 * <p>Example:</p>
		 * <pre>
		 *   const config = require('config');
		 *   const myObject = {hello:'world'};
		 *   config.util.makeImmutable(myObject);
		 * </pre>
		 *
		 * @method makeImmutable
		 * @param object {object} - The object to specify immutable properties for
		 * @param [property] {string | [string]} - The name of the property (or array of names) to make immutable.
		 *        If not provided, all owned properties of the object are made immutable.
		 * @param [value] {* | [*]} - Property value (or array of values) to set
		 *        the property to before making immutable. Only used when setting a single
		 *        property. Retained for backward compatibility.
		 * @return object {object} - The original object is returned - for chaining.
		 */
		util.makeImmutable = function(object, property, value) {
		  if (Buffer.isBuffer(object)) {
		    return object;
		  }
		  let properties = null;

		  // Backwards compatibility mode where property/value can be specified
		  if (typeof property === 'string') {
		    return Object.defineProperty(object, property, {
		      value : (typeof value === 'undefined') ? object[property] : value,
		      writable : false,
		      configurable: false
		    });
		  }

		  // Get the list of properties to work with
		  if (Array.isArray(property)) {
		    properties = property;
		  }
		  else {
		    properties = Object.keys(object);
		  }

		  // Process each property
		  for (let i = 0; i < properties.length; i++) {
		    const propertyName = properties[i];
		    let value = object[propertyName];

		    if (value instanceof RawConfig) {
		      Object.defineProperty(object, propertyName, {
		        value: value.resolve(),
		        writable: false,
		        configurable: false
		      });
		    } else if (Array.isArray(value)) {
		      // Ensure object items of this array are also immutable.
		      value.forEach((item, index) => { if (util.isObject(item) || Array.isArray(item)) util.makeImmutable(item); });

		      Object.defineProperty(object, propertyName, {
		        value: Object.freeze(value)
		      });
		    } else {
		      // Call recursively if an object.
		      if (util.isObject(value)) {
		        // Create a proxy, to capture user updates of configuration options, and throw an exception for awareness, as per:
		        // https://github.com/lorenwest/node-config/issues/514
		        value = new Proxy(util.makeImmutable(value), {
		          set (target, name) {
		            const message = (Reflect.has(target, name) ? 'update' : 'add');
		            // Notify the user.
		            throw Error(`Can not ${message} runtime configuration property: "${name}". Configuration objects are immutable unless ALLOW_CONFIG_MUTATIONS is set.`)
		          }
		        });
		      }

		      Object.defineProperty(object, propertyName, {
		        value: value,
		        writable : false,
		        configurable: false
		      });

		      // Ensure new properties can not be added, as per:
		      // https://github.com/lorenwest/node-config/issues/505
		      Object.preventExtensions(object[propertyName]);
		    }
		  }

		  return object;
		};

		/**
		 * Return the sources for the configurations
		 *
		 * <p>
		 * All sources for configurations are stored in an array of objects containing
		 * the source name (usually the filename), the original source (as a string),
		 * and the parsed source as an object.
		 * </p>
		 *
		 * @method getConfigSources
		 * @return configSources {Array[Object]} - An array of objects containing
		 *    name, original, and parsed elements
		 */
		util.getConfigSources = function() {
		  return configSources.slice(0);
		};

		/**
		 * Looks into an options object for a specific attribute
		 *
		 * <p>
		 * This method looks into the options object, and if an attribute is defined, returns it,
		 * and if not, returns the default value
		 * </p>
		 *
		 * @method getOption
		 * @param options {Object | undefined} the options object
		 * @param optionName {string} the attribute name to look for
		 * @param defaultValue { any } the default in case the options object is empty, or the attribute does not exist.
		 * @return options[optionName] if defined, defaultValue if not.
		 */
		util.getOption = function(options, optionName, defaultValue) {
		  if (options !== undefined && typeof options[optionName] !== 'undefined'){
		    return options[optionName];
		  } else {
		    return defaultValue;
		  }
		};


		/**
		 * Load the individual file configurations.
		 *
		 * <p>
		 * This method builds a map of filename to the configuration object defined
		 * by the file.  The search order is:
		 * </p>
		 *
		 * <pre>
		 *   default.EXT
		 *   (deployment).EXT
		 *   (hostname).EXT
		 *   (hostname)-(deployment).EXT
		 *   local.EXT
		 *   local-(deployment).EXT
		 *   runtime.json
		 * </pre>
		 *
		 * <p>
		 * EXT can be yml, yaml, coffee, iced, json, cson or js signifying the file type.
		 * yaml (and yml) is in YAML format, coffee is a coffee-script, iced is iced-coffee-script,
		 * json is in JSON format, cson is in CSON format, properties is in .properties format
		 * (http://en.wikipedia.org/wiki/.properties), and js is a javascript executable file that is
		 * require()'d with module.exports being the config object.
		 * </p>
		 *
		 * <p>
		 * hostname is the $HOST environment variable (or --HOST command line parameter)
		 * if set, otherwise the $HOSTNAME environment variable (or --HOSTNAME command
		 * line parameter) if set, otherwise the hostname found from
		 * require('os').hostname().
		 * </p>
		 *
		 * <p>
		 * Once a hostname is found, everything from the first period ('.') onwards
		 * is removed. For example, abc.example.com becomes abc
		 * </p>
		 *
		 * <p>
		 * (deployment) is the deployment type, found in the $NODE_ENV environment
		 * variable (which can be overridden by using $NODE_CONFIG_ENV
		 * environment variable). Defaults to 'development'.
		 * </p>
		 *
		 * <p>
		 * The runtime.json file contains configuration changes made at runtime either
		 * manually, or by the application setting a configuration value.
		 * </p>
		 *
		 * <p>
		 * If the $NODE_APP_INSTANCE environment variable (or --NODE_APP_INSTANCE
		 * command line parameter) is set, then files with this appendage will be loaded.
		 * See the Multiple Application Instances section of the main documentation page
		 * for more information.
		 * </p>
		 *
		 * @protected
		 * @method loadFileConfigs
		 * @param configDir { string | null } the path to the directory containing the configurations to load
		 * @param options { object | undefined } parsing options. Current supported option: skipConfigSources: true|false
		 * @return config {Object} The configuration object
		 */
		util.loadFileConfigs = function(configDir, options) {
		  const config = {};

		  // Specify variables that can be used to define the environment
		  const node_env_var_names = ['NODE_CONFIG_ENV', 'NODE_ENV'];

		  // Loop through the variables to try and set environment
		  for (const node_env_var_name of node_env_var_names) {
		    NODE_ENV = util.initParam(node_env_var_name);
		    if (!!NODE_ENV) {
		      NODE_ENV_VAR_NAME = node_env_var_name;
		      break;
		    }
		  }

		  // If we haven't successfully set the environment using the variables, we'll default it
		  if (!NODE_ENV) {
		    NODE_ENV = 'development';
		  }

		  node_env_var_names.forEach(node_env_var_name => {
		    env[node_env_var_name] = NODE_ENV;
		  });

		  // Split files name, for loading multiple files.
		  NODE_ENV = NODE_ENV.split(',');

		  let dir = configDir || util.initParam('NODE_CONFIG_DIR', Path.join( process.cwd(), 'config') );
		  dir = _toAbsolutePath(dir);

		  APP_INSTANCE = util.initParam('NODE_APP_INSTANCE');
		  CONFIG_SKIP_GITCRYPT = util.initParam('CONFIG_SKIP_GITCRYPT');

		  // This is for backward compatibility
		  const runtimeFilename = util.initParam('NODE_CONFIG_RUNTIME_JSON', Path.join(dir , 'runtime.json') );

		  NODE_CONFIG_PARSER = util.initParam('NODE_CONFIG_PARSER');
		  if (NODE_CONFIG_PARSER) {
		    try {
		      const parserModule = Path.isAbsolute(NODE_CONFIG_PARSER)
		        ? NODE_CONFIG_PARSER
		        : Path.join(dir, NODE_CONFIG_PARSER);
		      Parser = commonjsRequire(parserModule);
		    }
		    catch (e) {
		      console.warn('Failed to load config parser from ' + NODE_CONFIG_PARSER);
		      console.log(e);
		    }
		  }

		  const HOST = util.initParam('HOST');
		  const HOSTNAME = util.initParam('HOSTNAME');

		  // Determine the host name from the OS module, $HOST, or $HOSTNAME
		  // Remove any . appendages, and default to null if not set
		  let hostName = HOST || HOSTNAME;
		  try {
		    if (!hostName) {
		        const OS = require('os');
		        hostName = OS.hostname();
		    }
		  } catch (e) {
		    hostName = '';
		  }

		  // Store the hostname that won.
		  env.HOSTNAME = hostName;

		  // Read each file in turn
		  const baseNames = ['default'].concat(NODE_ENV);

		  // #236: Also add full hostname when they are different.
		  if (hostName) {
		    const firstDomain = hostName.split('.')[0];

		    NODE_ENV.forEach(function(env) {
		      // Backward compatibility
		      baseNames.push(firstDomain, firstDomain + '-' + env);

		      // Add full hostname when it is not the same
		      if (hostName !== firstDomain) {
		        baseNames.push(hostName, hostName + '-' + env);
		      }
		    });
		  }

		  NODE_ENV.forEach(function(env) {
		    baseNames.push('local', 'local-' + env);
		  });

		  const allowedFiles = {};
		  let resolutionIndex = 1;
		  const extNames = Parser.getFilesOrder();
		  baseNames.forEach(function(baseName) {
		    extNames.forEach(function(extName) {
		      allowedFiles[baseName + '.' + extName] = resolutionIndex++;
		      if (APP_INSTANCE) {
		        allowedFiles[baseName + '-' + APP_INSTANCE + '.' + extName] = resolutionIndex++;
		      }
		    });
		  });

		  const locatedFiles = util.locateMatchingFiles(dir, allowedFiles);
		  locatedFiles.forEach(function(fullFilename) {
		    const configObj = util.parseFile(fullFilename, options);
		    if (configObj) {
		      util.extendDeep(config, configObj);
		    }
		  });

		  // Override configurations from the $NODE_CONFIG environment variable
		  // NODE_CONFIG only applies to the base config
		  if (!configDir) {
		    let envConfig = {};

		    CONFIG_DIR = dir;

		    if (process.env.NODE_CONFIG) {
		      try {
		        envConfig = JSON.parse(process.env.NODE_CONFIG);
		      } catch(e) {
		        console.error('The $NODE_CONFIG environment variable is malformed JSON');
		      }
		      util.extendDeep(config, envConfig);
		      const skipConfigSources = util.getOption(options,'skipConfigSources', false);
		      if (!skipConfigSources){
		        configSources.push({
		          name: "$NODE_CONFIG",
		          parsed: envConfig,
		        });
		      }
		    }

		    // Override configurations from the --NODE_CONFIG command line
		    let cmdLineConfig = util.getCmdLineArg('NODE_CONFIG');
		    if (cmdLineConfig) {
		      try {
		        cmdLineConfig = JSON.parse(cmdLineConfig);
		      } catch(e) {
		        console.error('The --NODE_CONFIG={json} command line argument is malformed JSON');
		      }
		      util.extendDeep(config, cmdLineConfig);
		      const skipConfigSources = util.getOption(options,'skipConfigSources', false);
		      if (!skipConfigSources){
		        configSources.push({
		          name: "--NODE_CONFIG argument",
		          parsed: cmdLineConfig,
		        });
		      }
		    }

		    // Place the mixed NODE_CONFIG into the environment
		    env['NODE_CONFIG'] = JSON.stringify(util.extendDeep(envConfig, cmdLineConfig, {}));
		  }

		  // Override with environment variables if there is a custom-environment-variables.EXT mapping file
		  const customEnvVars = util.getCustomEnvVars(dir, extNames);
		  util.extendDeep(config, customEnvVars);

		  // Extend the original config with the contents of runtime.json (backwards compatibility)
		  const runtimeJson = util.parseFile(runtimeFilename) || {};
		  util.extendDeep(config, runtimeJson);

		  util.resolveDeferredConfigs(config);

		  // Return the configuration object
		  return config;
		};

		/**
		 * Return a list of fullFilenames who exists in allowedFiles
		 * Ordered according to allowedFiles argument specifications
		 *
		 * @protected
		 * @method locateMatchingFiles
		 * @param configDirs {string}   the config dir, or multiple dirs separated by a column (:)
		 * @param allowedFiles {object} an object. keys and supported filenames
		 *                              and values are the position in the resolution order
		 * @returns {string[]}          fullFilenames - path + filename
		 */
		util.locateMatchingFiles = function(configDirs, allowedFiles) {
		  return configDirs.split(Path.delimiter)
		    .reduce(function(files, configDir) {
		      if (configDir) {
		        configDir = _toAbsolutePath(configDir);
		        try {
		          FileSystem.readdirSync(configDir).forEach(function(file) {
		            if (allowedFiles[file]) {
		              files.push([allowedFiles[file], Path.join(configDir, file)]);
		            }
		          });
		        }
		        catch(e) {}
		        return files;
		      }
		    }, [])
		    .sort(function(a, b) { return a[0] - b[0]; })
		    .map(function(file) { return file[1]; });
		};

		// Using basic recursion pattern, find all the deferred values and resolve them.
		util.resolveDeferredConfigs = function (config) {
		  const deferred = [];

		  function _iterate (prop) {

		    // We put the properties we are going to look it in an array to keep the order predictable
		    const propsToSort = [];

		    // First step is to put the properties of interest in an array
		    for (const property in prop) {
		      if (Object.hasOwnProperty.call(prop, property) && prop[property] != null) {
		        propsToSort.push(property);
		      }
		    }

		    // Second step is to iterate of the elements in a predictable (sorted) order
		    propsToSort.sort().forEach(function (property) {
		      if (prop[property].constructor === Object) {
		        _iterate(prop[property]);
		      } else if (prop[property].constructor === Array) {
		        for (let i = 0; i < prop[property].length; i++) {
		          if (prop[property][i] instanceof DeferredConfig) {
		            deferred.push(prop[property][i].prepare(config, prop[property], i));
		          }
		          else {
		            _iterate(prop[property][i]);
		          }
		        }
		      } else {
		        if (prop[property] instanceof DeferredConfig) {
		          deferred.push(prop[property].prepare(config, prop, property));
		        }
		        // else: Nothing to do. Keep the property how it is.
		      }
		    });
		  }

		  _iterate(config);

		  deferred.forEach(function (defer) { defer.resolve(); });
		};

		/**
		 * Parse and return the specified configuration file.
		 *
		 * If the file exists in the application config directory, it will
		 * parse and return it as a JavaScript object.
		 *
		 * The file extension determines the parser to use.
		 *
		 * .js = File to run that has a module.exports containing the config object
		 * .coffee = File to run that has a module.exports with coffee-script containing the config object
		 * .iced = File to run that has a module.exports with iced-coffee-script containing the config object
		 * All other supported file types (yaml, toml, json, cson, hjson, json5, properties, xml)
		 * are parsed with util.parseString.
		 *
		 * If the file doesn't exist, a null will be returned.  If the file can't be
		 * parsed, an exception will be thrown.
		 *
		 * This method performs synchronous file operations, and should not be called
		 * after synchronous module loading.
		 *
		 * @protected
		 * @method parseFile
		 * @param fullFilename {string} The full file path and name
		 * @param options { object | undefined } parsing options. Current supported option: skipConfigSources: true|false
		 * @return configObject {object|null} The configuration object parsed from the file
		 */
		util.parseFile = function(fullFilename, options) {
		  let configObject = null;
		  let fileContent = null;

		  // Note that all methods here are the Sync versions.  This is appropriate during
		  // module loading (which is a synchronous operation), but not thereafter.

		  try {
		    // Try loading the file.
		    fileContent = FileSystem.readFileSync(fullFilename, 'utf-8');
		    fileContent = fileContent.replace(/^\uFEFF/, '');
		  }
		  catch (e2) {
		    if (e2.code !== 'ENOENT') {
		      throw new Error('Config file ' + fullFilename + ' cannot be read. Error code is: '+e2.code
		                        +'. Error message is: '+e2.message);
		    }
		    return null;  // file doesn't exists
		  }

		  // Parse the file based on extension
		  try {

		    // skip if it's a gitcrypt file and CONFIG_SKIP_GITCRYPT is true
		    if (CONFIG_SKIP_GITCRYPT) {
		      if (gitCryptTestRegex.test(fileContent)) {
		        console.error('WARNING: ' + fullFilename + ' is a git-crypt file and CONFIG_SKIP_GITCRYPT is set. skipping.');
		        return null;
		      }
		    }

		    configObject = Parser.parse(fullFilename, fileContent);
		  }
		  catch (e3) {
		    if (gitCryptTestRegex.test(fileContent)) {
		      console.error('ERROR: ' + fullFilename + ' is a git-crypt file and CONFIG_SKIP_GITCRYPT is not set.');
		    }
		    throw new Error("Cannot parse config file: '" + fullFilename + "': " + e3);
		  }

		  // Keep track of this configuration sources, including empty ones, unless the skipConfigSources flag is set to true in the options
		  const skipConfigSources = util.getOption(options,'skipConfigSources', false);
		  if (typeof configObject === 'object' && !skipConfigSources) {
		    configSources.push({
		      name: fullFilename,
		      original: fileContent,
		      parsed: configObject,
		    });
		  }

		  return configObject;
		};

		/**
		 * Parse and return the specified string with the specified format.
		 *
		 * The format determines the parser to use.
		 *
		 * json = File is parsed using JSON.parse()
		 * yaml (or yml) = Parsed with a YAML parser
		 * toml = Parsed with a TOML parser
		 * cson = Parsed with a CSON parser
		 * hjson = Parsed with a HJSON parser
		 * json5 = Parsed with a JSON5 parser
		 * properties = Parsed with the 'properties' node package
		 * xml = Parsed with a XML parser
		 *
		 * If the file doesn't exist, a null will be returned.  If the file can't be
		 * parsed, an exception will be thrown.
		 *
		 * This method performs synchronous file operations, and should not be called
		 * after synchronous module loading.
		 *
		 * @protected
		 * @method parseString
		 * @param content {string} The full content
		 * @param format {string} The format to be parsed
		 * @return {configObject} The configuration object parsed from the string
		 */
		util.parseString = function (content, format) {
		  const parser = Parser.getParser(format);
		  if (typeof parser === 'function') {
		    return parser(null, content);
		  }
		};

		/**
		 * Attach the Config class prototype to all config objects recursively.
		 *
		 * <p>
		 * This allows you to do anything with CONFIG sub-objects as you can do with
		 * the top-level CONFIG object.  It's so you can do this:
		 * </p>
		 *
		 * <pre>
		 *   const CUST_CONFIG = require('config').Customer;
		 *   CUST_CONFIG.get(...)
		 * </pre>
		 *
		 * @protected
		 * @method attachProtoDeep
		 * @param toObject
		 * @param depth
		 * @return toObject
		 */
		util.attachProtoDeep = function(toObject, depth) {
		  if (toObject instanceof RawConfig) {
		    return toObject;
		  }
		  depth = (depth === null ? DEFAULT_CLONE_DEPTH : depth);
		  if (depth < 0) {
		    return toObject;
		  }

		  // Adding Config.prototype methods directly to toObject as hidden properties
		  // because adding to toObject.__proto__ exposes the function in toObject
		  for (const fnName in Config.prototype) {
		    if (!toObject[fnName]) {
		      util.makeHidden(toObject, fnName, Config.prototype[fnName]);
		    }
		  }

		  // Add prototypes to sub-objects
		  for (const prop in toObject) {
		    if (util.isObject(toObject[prop])) {
		      util.attachProtoDeep(toObject[prop], depth - 1);
		    }
		  }

		  // Return the original object
		  return toObject;
		};

		/**
		 * Return a deep copy of the specified object.
		 *
		 * This returns a new object with all elements copied from the specified
		 * object.  Deep copies are made of objects and arrays so you can do anything
		 * with the returned object without affecting the input object.
		 *
		 * @protected
		 * @method cloneDeep
		 * @param parent {object} The original object to copy from
		 * @param [depth=20] {Integer} Maximum depth (default 20)
		 * @return {object} A new object with the elements copied from the copyFrom object
		 *
		 * This method is copied from https://github.com/pvorb/node-clone/blob/17eea36140d61d97a9954c53417d0e04a00525d9/clone.js
		 *
		 * Copyright © 2011-2014 Paul Vorbach and contributors.
		 * Permission is hereby granted, free of charge, to any person obtaining a copy
		 * of this software and associated documentation files (the “Software”), to deal
		 * in the Software without restriction, including without limitation the rights
		 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
		 * of the Software, and to permit persons to whom the Software is furnished to do so,
		 * subject to the following conditions: The above copyright notice and this permission
		 * notice shall be included in all copies or substantial portions of the Software.
		 */
		util.cloneDeep = function cloneDeep(parent, depth, circular, prototype) {
		  // maintain two arrays for circular references, where corresponding parents
		  // and children have the same index
		  const allParents = [];
		  const allChildren = [];

		  const useBuffer = typeof Buffer !== 'undefined';

		  if (typeof circular === 'undefined')
		    circular = true;

		  if (typeof depth === 'undefined')
		    depth = 20;

		  // recurse this function so we don't reset allParents and allChildren
		  function _clone(parent, depth) {
		    // cloning null always returns null
		    if (parent === null)
		      return null;

		    if (depth === 0)
		      return parent;

		    let child;
		    if (typeof parent != 'object') {
		      return parent;
		    }

		    if (Array.isArray(parent)) {
		      child = [];
		    } else if (parent instanceof RegExp) {
		      child = new RegExp(parent.source, util.getRegExpFlags(parent));
		      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
		    } else if (parent instanceof Date) {
		      child = new Date(parent.getTime());
		    } else if (useBuffer && Buffer.isBuffer(parent)) {
		      child = Buffer.alloc(parent.length);
		      parent.copy(child);
		      return child;
		    } else {
		      if (typeof prototype === 'undefined') child = Object.create(Object.getPrototypeOf(parent));
		      else child = Object.create(prototype);
		    }

		    if (circular) {
		      const index = allParents.indexOf(parent);

		      if (index != -1) {
		        return allChildren[index];
		      }
		      allParents.push(parent);
		      allChildren.push(child);
		    }

		    for (const i in parent) {
		      const propDescriptor  = Object.getOwnPropertyDescriptor(parent,i);
		      const hasGetter = ((typeof propDescriptor !== 'undefined') && (typeof propDescriptor.get !== 'undefined'));

		      if (hasGetter){
		        Object.defineProperty(child,i,propDescriptor);
		      } else if (util.isPromise(parent[i])) {
		        child[i] = parent[i];
		      } else {
		        child[i] = _clone(parent[i], depth - 1);
		      }
		    }

		    return child;
		  }

		  return _clone(parent, depth);
		};

		/**
		 * Set objects given a path as a string list
		 *
		 * @protected
		 * @method setPath
		 * @param object {object} - Object to set the property on
		 * @param path {array[string]} - Array path to the property
		 * @param value {*} - value to set, ignoring null
		 */
		util.setPath = function (object, path, value) {
		  let nextKey = null;
		  if (value === null || path.length === 0) {
		    return;
		  }
		  else if (path.length === 1) { // no more keys to make, so set the value
		    object[path.shift()] = value;
		  }
		  else {
		    nextKey = path.shift();
		    if (!Object.hasOwnProperty.call(object, nextKey)) {
		      object[nextKey] = {};
		    }
		    util.setPath(object[nextKey], path, value);
		  }
		};

		/**
		 * Create a new object patterned after substitutionMap, where:
		 * 1. Terminal string values in substitutionMap are used as keys
		 * 2. To look up values in a key-value store, variables
		 * 3. And parent keys are created as necessary to retain the structure of substitutionMap.
		 *
		 * @protected
		 * @method substituteDeep
		 * @param substitutionMap {object} - an object whose terminal (non-subobject) values are strings
		 * @param variables {object[string:value]} - usually process.env, a flat object used to transform
		 *      terminal values in a copy of substitutionMap.
		 * @returns {object} - deep copy of substitutionMap with only those paths whose terminal values
		 *      corresponded to a key in `variables`
		 */
		util.substituteDeep = function (substitutionMap, variables) {
		  const result = {};

		  function _substituteVars(map, vars, pathTo) {
		    for (const prop in map) {
		      const value = map[prop];
		      if (typeof(value) === 'string') { // We found a leaf variable name
		        if (typeof vars[value] !== 'undefined' && vars[value] !== '') { // if the vars provide a value set the value in the result map
		          util.setPath(result, pathTo.concat(prop), vars[value]);
		        }
		      }
		      else if (util.isObject(value)) { // work on the subtree, giving it a clone of the pathTo
		        if ('__name' in value && '__format' in value && typeof vars[value.__name] !== 'undefined' && vars[value.__name] !== '') {
		          let parsedValue;
		          try {
		            parsedValue = util.parseString(vars[value.__name], value.__format);
		          } catch(err) {
		            err.message = '__format parser error in ' + value.__name + ': ' + err.message;
		            throw err;
		          }
		          util.setPath(result, pathTo.concat(prop), parsedValue);
		        } else {
		          _substituteVars(value, vars, pathTo.concat(prop));
		        }
		      }
		      else {
		        msg = "Illegal key type for substitution map at " + pathTo.join('.') + ': ' + typeof(value);
		        throw Error(msg);
		      }
		    }
		  }

		  _substituteVars(substitutionMap, variables, []);
		  return result;

		};

		/* Map environment variables into the configuration if a mapping file,
		 * `custom-environment-variables.EXT` exists.
		 *
		 * @protected
		 * @method getCustomEnvVars
		 * @param configDir {string} - the passed configuration directory
		 * @param extNames {Array[string]} - acceptable configuration file extension names.
		 * @returns {object} - mapped environment variables or {} if there are none
		 */
		util.getCustomEnvVars = function (configDir, extNames) {
		  const result = {};
		  let resolutionIndex = 1;
		  const allowedFiles = {};
		  extNames.forEach(function (extName) {
		    allowedFiles['custom-environment-variables' + '.' + extName] = resolutionIndex++;
		  });
		  const locatedFiles = util.locateMatchingFiles(configDir, allowedFiles);
		  locatedFiles.forEach(function (fullFilename) {
		    const configObj = util.parseFile(fullFilename);
		    if (configObj) {
		      const environmentSubstitutions = util.substituteDeep(configObj, process.env);
		      util.extendDeep(result, environmentSubstitutions);
		    }
		  });
		  return result;
		};

		/**
		 * Return true if two objects have equal contents.
		 *
		 * @protected
		 * @method equalsDeep
		 * @param object1 {object} The object to compare from
		 * @param object2 {object} The object to compare with
		 * @param depth {integer} An optional depth to prevent recursion.  Default: 20.
		 * @return {boolean} True if both objects have equivalent contents
		 */
		util.equalsDeep = function(object1, object2, depth) {
		  depth = (depth === null ? DEFAULT_CLONE_DEPTH : depth);
		  if (depth < 0) {
		    return {};
		  }

		  // Fast comparisons
		  if (!object1 || !object2) {
		    return false;
		  }
		  if (object1 === object2) {
		    return true;
		  }
		  if (typeof(object1) != 'object' || typeof(object2) != 'object') {
		    return false;
		  }

		  // They must have the same keys.  If their length isn't the same
		  // then they're not equal.  If the keys aren't the same, the value
		  // comparisons will fail.
		  if (Object.keys(object1).length != Object.keys(object2).length) {
		    return false;
		  }

		  // Compare the values
		  for (const prop in object1) {

		    // Call recursively if an object or array
		    if (object1[prop] && typeof(object1[prop]) === 'object') {
		      if (!util.equalsDeep(object1[prop], object2[prop], depth - 1)) {
		        return false;
		      }
		    }
		    else {
		      if (object1[prop] !== object2[prop]) {
		        return false;
		      }
		    }
		  }

		  // Test passed.
		  return true;
		};

		/**
		 * Returns an object containing all elements that differ between two objects.
		 * <p>
		 * This method was designed to be used to create the runtime.json file
		 * contents, but can be used to get the diffs between any two Javascript objects.
		 * </p>
		 * <p>
		 * It works best when object2 originated by deep copying object1, then
		 * changes were made to object2, and you want an object that would give you
		 * the changes made to object1 which resulted in object2.
		 * </p>
		 *
		 * @protected
		 * @method diffDeep
		 * @param object1 {object} The base object to compare to
		 * @param object2 {object} The object to compare with
		 * @param depth {integer} An optional depth to prevent recursion.  Default: 20.
		 * @return {object} A differential object, which if extended onto object1 would
		 *                  result in object2.
		 */
		util.diffDeep = function(object1, object2, depth) {
		  const diff = {};
		  depth = (depth === null ? DEFAULT_CLONE_DEPTH : depth);
		  if (depth < 0) {
		    return {};
		  }

		  // Process each element from object2, adding any element that's different
		  // from object 1.
		  for (const parm in object2) {
		    const value1 = object1[parm];
		    const value2 = object2[parm];
		    if (value1 && value2 && util.isObject(value2)) {
		      if (!(util.equalsDeep(value1, value2))) {
		        diff[parm] = util.diffDeep(value1, value2, depth - 1);
		      }
		    }
		    else if (Array.isArray(value1) && Array.isArray(value2)) {
		      if(!util.equalsDeep(value1, value2)) {
		        diff[parm] = value2;
		      }
		    }
		    else if (value1 !== value2){
		      diff[parm] = value2;
		    }
		  }

		  // Return the diff object
		  return diff;

		};

		/**
		 * Extend an object, and any object it contains.
		 *
		 * This does not replace deep objects, but dives into them
		 * replacing individual elements instead.
		 *
		 * @protected
		 * @method extendDeep
		 * @param mergeInto {object} The object to merge into
		 * @param mergeFrom... {object...} - Any number of objects to merge from
		 * @param depth {integer} An optional depth to prevent recursion.  Default: 20.
		 * @return {object} The altered mergeInto object is returned
		 */
		util.extendDeep = function(mergeInto) {
		  const vargs = Array.prototype.slice.call(arguments, 1);
		  let depth = vargs.pop();
		  if (typeof(depth) != 'number') {
		    vargs.push(depth);
		    depth = DEFAULT_CLONE_DEPTH;
		  }

		  // Recursion detection
		  if (depth < 0) {
		    return mergeInto;
		  }

		  // Cycle through each object to extend
		  vargs.forEach(function(mergeFrom) {

		    // Cycle through each element of the object to merge from
		    for (const prop in mergeFrom) {

		      // save original value in deferred elements
		      const fromIsDeferredFunc = mergeFrom[prop] instanceof DeferredConfig;
		      const isDeferredFunc = mergeInto[prop] instanceof DeferredConfig;

		      if (fromIsDeferredFunc && Object.hasOwnProperty.call(mergeInto, prop)) {
		        mergeFrom[prop]._original = isDeferredFunc ? mergeInto[prop]._original : mergeInto[prop];
		      }
		      // Extend recursively if both elements are objects and target is not really a deferred function
		      if (mergeFrom[prop] instanceof Date) {
		        mergeInto[prop] = mergeFrom[prop];
		      } if (mergeFrom[prop] instanceof RegExp) {
		        mergeInto[prop] = mergeFrom[prop];
		      } else if (util.isObject(mergeInto[prop]) && util.isObject(mergeFrom[prop]) && !isDeferredFunc) {
		        util.extendDeep(mergeInto[prop], mergeFrom[prop], depth - 1);
		      }
		      else if (util.isPromise(mergeFrom[prop])) {
		        mergeInto[prop] = mergeFrom[prop];
		      }
		      // Copy recursively if the mergeFrom element is an object (or array or fn)
		      else if (mergeFrom[prop] && typeof mergeFrom[prop] === 'object') {
		        mergeInto[prop] = util.cloneDeep(mergeFrom[prop], depth -1);
		      }

		      // Copy property descriptor otherwise, preserving accessors
		      else if (Object.getOwnPropertyDescriptor(Object(mergeFrom), prop)){
		          Object.defineProperty(mergeInto, prop, Object.getOwnPropertyDescriptor(Object(mergeFrom), prop));
		      } else {
		          mergeInto[prop] = mergeFrom[prop];
		      }
		    }
		  });

		  // Chain
		  return mergeInto;

		};

		/**
		 * Is the specified argument a regular javascript object?
		 *
		 * The argument is an object if it's a JS object, but not an array.
		 *
		 * @protected
		 * @method isObject
		 * @param obj {*} An argument of any type.
		 * @return {boolean} TRUE if the arg is an object, FALSE if not
		 */
		util.isObject = function(obj) {
		  return (obj !== null) && (typeof obj === 'object') && !(Array.isArray(obj));
		};

		/**
		 * Is the specified argument a javascript promise?
		 *
		 * @protected
		 * @method isPromise
		 * @param obj {*} An argument of any type.
		 * @returns {boolean}
		 */
		util.isPromise = function(obj) {
		  return Object.prototype.toString.call(obj) === '[object Promise]';
		};

		/**
		 * <p>Initialize a parameter from the command line or process environment</p>
		 *
		 * <p>
		 * This method looks for the parameter from the command line in the format
		 * --PARAMETER=VALUE, then from the process environment, then from the
		 * default specified as an argument.
		 * </p>
		 *
		 * @method initParam
		 * @param paramName {String} Name of the parameter
		 * @param [defaultValue] {Any} Default value of the parameter
		 * @return {Any} The found value, or default value
		 */
		util.initParam = function (paramName, defaultValue) {

		  // Record and return the value
		  const value = util.getCmdLineArg(paramName) || process.env[paramName] || defaultValue;
		  env[paramName] = value;
		  return value;
		};

		/**
		 * <p>Get Command Line Arguments</p>
		 *
		 * <p>
		 * This method allows you to retrieve the value of the specified command line argument.
		 * </p>
		 *
		 * <p>
		 * The argument is case sensitive, and must be of the form '--ARG_NAME=value'
		 * </p>
		 *
		 * @method getCmdLineArg
		 * @param searchFor {String} The argument name to search for
		 * @return {*} false if the argument was not found, the argument value if found
		 */
		util.getCmdLineArg = function (searchFor) {
		    const cmdLineArgs = process.argv.slice(2, process.argv.length);
		    const argName = '--' + searchFor + '=';

		    for (let argvIt = 0; argvIt < cmdLineArgs.length; argvIt++) {
		      if (cmdLineArgs[argvIt].indexOf(argName) === 0) {
		        return cmdLineArgs[argvIt].substr(argName.length);
		      }
		    }

		    return false;
		};

		/**
		 * <p>Get a Config Environment Variable Value</p>
		 *
		 * <p>
		 * This method returns the value of the specified config environment variable,
		 * including any defaults or overrides.
		 * </p>
		 *
		 * @method getEnv
		 * @param varName {String} The environment variable name
		 * @return {String} The value of the environment variable
		 */
		util.getEnv = function (varName) {
		  return env[varName];
		};



		/**
		 * Returns a string of flags for regular expression `re`.
		 *
		 * @param {RegExp} re Regular expression
		 * @returns {string} Flags
		 */
		util.getRegExpFlags = function (re) {
		  let flags = '';
		  re.global && (flags += 'g');
		  re.ignoreCase && (flags += 'i');
		  re.multiline && (flags += 'm');
		  return flags;
		};

		/**
		 * Returns a new deep copy of the current config object, or any part of the config if provided.
		 *
		 * @param {Object} config The part of the config to copy and serialize. Omit this argument to return the entire config.
		 * @returns {Object} The cloned config or part of the config
		 */
		util.toObject = function(config) {
		  return JSON.parse(JSON.stringify(config || this));
		};

		// Run strictness checks on NODE_ENV and NODE_APP_INSTANCE and throw an error if there's a problem.
		util.runStrictnessChecks = function (config) {
		  const sources = config.util.getConfigSources();

		  const sourceFilenames = sources.map(function (src) {
		    return Path.basename(src.name);
		  });

		  NODE_ENV.forEach(function(env) {
		    // Throw an exception if there's no explicit config file for NODE_ENV
		    const anyFilesMatchEnv = sourceFilenames.some(function (filename) {
		        return filename.match(env);
		    });
		    // development is special-cased because it's the default value
		    if (env && (env !== 'development') && !anyFilesMatchEnv) {
		      _warnOrThrow(NODE_ENV_VAR_NAME+" value of '"+env+"' did not match any deployment config file names.");
		    }
		    // Throw if NODE_ENV matches' default' or 'local'
		    if ((env === 'default') || (env === 'local')) {
		      _warnOrThrow(NODE_ENV_VAR_NAME+" value of '"+env+"' is ambiguous.");
		    }
		  });

		  // Throw an exception if there's no explicit config file for NODE_APP_INSTANCE
		  const anyFilesMatchInstance = sourceFilenames.some(function (filename) {
		      return filename.match(APP_INSTANCE);
		  });
		  if (APP_INSTANCE && !anyFilesMatchInstance) {
		    _warnOrThrow("NODE_APP_INSTANCE value of '"+APP_INSTANCE+"' did not match any instance config file names.");
		  }

		  function _warnOrThrow (msg) {
		    const beStrict = process.env.NODE_CONFIG_STRICT_MODE;
		    const prefix = beStrict ? 'FATAL: ' : 'WARNING: ';
		    const seeURL = 'See https://github.com/node-config/node-config/wiki/Strict-Mode';

		    console.error(prefix+msg);
		    console.error(prefix+seeURL);

		    // Accept 1 and true as truthy values. When set via process.env, Node.js casts them to strings.
		    if (["true", "1"].indexOf(beStrict) >= 0) {
		      throw new Error(prefix+msg+' '+seeURL);
		    }
		  }
		};

		// Helper functions shared accross object members
		function _toAbsolutePath (configDir) {
		  if (configDir.indexOf('.') === 0) {
		    return Path.join(process.cwd(), configDir);
		  }

		  return configDir;
		}

		// Instantiate and export the configuration
		const config = config$1.exports = new Config();

		// copy methods to util for backwards compatibility
		util.stripComments = Parser.stripComments;
		util.stripYamlComments = Parser.stripYamlComments;

		// Produce warnings if the configuration is empty
		const showWarnings = !(util.initParam('SUPPRESS_NO_CONFIG_WARNING'));
		if (showWarnings && Object.keys(config).length === 0) {
		  console.error('WARNING: No configurations found in configuration directory:' +CONFIG_DIR);
		  console.error('WARNING: To disable this warning set SUPPRESS_NO_CONFIG_WARNING in the environment.');
		}
		return config$1.exports;
	}

	var config;
	var hasRequiredConfig;

	function requireConfig () {
		if (hasRequiredConfig) return config;
		hasRequiredConfig = 1;
		let signalingConfig;

		if (typeof window === 'undefined') {
		    requireMain().config();
		    const config = requireConfig$1();
		    signalingConfig = config.get('signaling');
		} else {
		    signalingConfig = {};
		    signalingConfig.get = (x) => {
		        if (x === 'websocket-url')
		            return window.signaling_websocket_url;
		        return signalingConfig[x];
		    };
		}

		function getSignalingConfig() {
		    return signalingConfig;
		}

		config = { getSignalingConfig };
		return config;
	}

	var signaling;
	var hasRequiredSignaling;

	function requireSignaling () {
		if (hasRequiredSignaling) return signaling;
		hasRequiredSignaling = 1;
		requireConfig();
		const { SimpleDataMessage } = requireSimple();
		const { getSignalingConfig } = requireConfig();

		class Signaler {
		    connect(onConnected, port='') {
		        this.socket = new WebSocket(getSignalingConfig().get('websocket-url')+port, []);
		        this.socket.onopen = onConnected;
		    }

		    disconnect() {
		        if (this.socket && this.socket.readyState != WebSocket.CLOSED) {
		            this.socket.close();
		        }
		    }

		    setOnReceivedMessage(onMessage) {
		        this.socket.onmessage = async (event) => {
		            try {
		                let buffer = await event.data.arrayBuffer();
		                let message = Signaler.deserialize(buffer);
		                onMessage(message);
		            } catch(e) {
		                console.error(`Signaler received weird message: ${event.data}`);
		                console.error(e);
		            }
		        };
		    }

		    send(message) {
		        let buffer = Signaler.serialize(message);
		        this.socket.send(buffer);
		    }

		    static deserialize(buffer) {
		        return SimpleDataMessage.fromBuffer(buffer);
		    }

		    static serialize(message) {
		        return message.toBuffer();
		    }
		}

		signaling = { Signaler };
		return signaling;
	}

	var binding = {exports: {}};

	var hasRequiredBinding;

	function requireBinding () {
		if (hasRequiredBinding) return binding.exports;
		hasRequiredBinding = 1;

		const os = require$$2;
		const triple = `${os.platform()}-${os.arch()}`;
		const paths_to_try = [
		  `../build-${triple}/wrtc.node`,
		  `../build-${triple}/Debug/wrtc.node`,
		  `../build-${triple}/Release/wrtc.node`,
		  `@roamhq/wrtc-${triple}`,
		  // For installations that can't resolve node_modules directly, like AWS Lambda
		  `./node_modules/@roamhq/wrtc-${triple}`,
		  `./node_modules/@roamhq/wrtc-${triple}/wrtc.node`,
		];

		let succeeded = false;
		for (const path of paths_to_try) {
		  try {
		    binding.exports = commonjsRequire(path);
		    succeeded = true;
		    break;
		  } catch (error) {
		  }
		}

		if (!succeeded) {
		  throw new Error(`Could not find wrtc binary on any of the paths: ${paths_to_try}`);
		}
		return binding.exports;
	}

	var eventtarget;
	var hasRequiredEventtarget;

	function requireEventtarget () {
		if (hasRequiredEventtarget) return eventtarget;
		hasRequiredEventtarget = 1;

		/**
		 * @author mrdoob / http://mrdoob.com/
		 * @author Jesús Leganés Combarro "Piranna" <piranna@gmail.com>
		 */

		function EventTarget() {
		  this._listeners = {};
		}

		EventTarget.prototype.addEventListener = function addEventListener(type, listener) {
		  const listeners = this._listeners = this._listeners || {};

		  if (!listeners[type]) {
		    listeners[type] = new Set();
		  }

		  listeners[type].add(listener);
		};

		EventTarget.prototype.dispatchEvent = function dispatchEvent(event) {
		  let listeners = this._listeners = this._listeners || {};

		  process.nextTick(() => {
		    listeners = new Set(listeners[event.type] || []);

		    const dummyListener = this['on' + event.type];
		    if (typeof dummyListener === 'function') {
		      listeners.add(dummyListener);
		    }

		    listeners.forEach(listener => {
		      if (typeof listener === 'object' && typeof listener.handleEvent === 'function') {
		        listener.handleEvent(event);
		      } else {
		        listener.call(this, event);
		      }
		    });
		  });
		};

		EventTarget.prototype.removeEventListener = function removeEventListener(type, listener) {
		  const listeners = this._listeners = this._listeners || {};
		  if (listeners[type]) {
		    listeners[type].delete(listener);
		  }
		};

		eventtarget = EventTarget;
		return eventtarget;
	}

	var mediadevices;
	var hasRequiredMediadevices;

	function requireMediadevices () {
		if (hasRequiredMediadevices) return mediadevices;
		hasRequiredMediadevices = 1;

		var inherits = require$$0$3.inherits;

		const { getDisplayMedia, getUserMedia } = requireBinding();

		var EventTarget = requireEventtarget();

		function MediaDevices() {}

		inherits(MediaDevices, EventTarget);

		MediaDevices.prototype.enumerateDevices = function enumerateDevices() {
		  throw new Error('Not yet implemented; file a feature request against node-webrtc');
		};

		MediaDevices.prototype.getSupportedConstraints = function getSupportedConstraints() {
		  return {
		    width: true,
		    height: true,
		  };
		};

		MediaDevices.prototype.getDisplayMedia = getDisplayMedia;
		MediaDevices.prototype.getUserMedia = getUserMedia;

		mediadevices = MediaDevices;
		return mediadevices;
	}

	var DOMException = {};

	var lib$1 = {};

	var hasRequiredLib$1;

	function requireLib$1 () {
		if (hasRequiredLib$1) return lib$1;
		hasRequiredLib$1 = 1;
		(function (exports) {

			function makeException(ErrorType, message, options) {
			  if (options.globals) {
			    ErrorType = options.globals[ErrorType.name];
			  }
			  return new ErrorType(`${options.context ? options.context : "Value"} ${message}.`);
			}

			function toNumber(value, options) {
			  if (typeof value === "bigint") {
			    throw makeException(TypeError, "is a BigInt which cannot be converted to a number", options);
			  }
			  if (!options.globals) {
			    return Number(value);
			  }
			  return options.globals.Number(value);
			}

			// Round x to the nearest integer, choosing the even integer if it lies halfway between two.
			function evenRound(x) {
			  // There are four cases for numbers with fractional part being .5:
			  //
			  // case |     x     | floor(x) | round(x) | expected | x <> 0 | x % 1 | x & 1 |   example
			  //   1  |  2n + 0.5 |  2n      |  2n + 1  |  2n      |   >    |  0.5  |   0   |  0.5 ->  0
			  //   2  |  2n + 1.5 |  2n + 1  |  2n + 2  |  2n + 2  |   >    |  0.5  |   1   |  1.5 ->  2
			  //   3  | -2n - 0.5 | -2n - 1  | -2n      | -2n      |   <    | -0.5  |   0   | -0.5 ->  0
			  //   4  | -2n - 1.5 | -2n - 2  | -2n - 1  | -2n - 2  |   <    | -0.5  |   1   | -1.5 -> -2
			  // (where n is a non-negative integer)
			  //
			  // Branch here for cases 1 and 4
			  if ((x > 0 && (x % 1) === 0.5 && (x & 1) === 0) ||
			        (x < 0 && (x % 1) === -0.5 && (x & 1) === 1)) {
			    return censorNegativeZero(Math.floor(x));
			  }

			  return censorNegativeZero(Math.round(x));
			}

			function integerPart(n) {
			  return censorNegativeZero(Math.trunc(n));
			}

			function sign(x) {
			  return x < 0 ? -1 : 1;
			}

			function modulo(x, y) {
			  // https://tc39.github.io/ecma262/#eqn-modulo
			  // Note that http://stackoverflow.com/a/4467559/3191 does NOT work for large modulos
			  const signMightNotMatch = x % y;
			  if (sign(y) !== sign(signMightNotMatch)) {
			    return signMightNotMatch + y;
			  }
			  return signMightNotMatch;
			}

			function censorNegativeZero(x) {
			  return x === 0 ? 0 : x;
			}

			function createIntegerConversion(bitLength, { unsigned }) {
			  let lowerBound, upperBound;
			  if (unsigned) {
			    lowerBound = 0;
			    upperBound = 2 ** bitLength - 1;
			  } else {
			    lowerBound = -(2 ** (bitLength - 1));
			    upperBound = 2 ** (bitLength - 1) - 1;
			  }

			  const twoToTheBitLength = 2 ** bitLength;
			  const twoToOneLessThanTheBitLength = 2 ** (bitLength - 1);

			  return (value, options = {}) => {
			    let x = toNumber(value, options);
			    x = censorNegativeZero(x);

			    if (options.enforceRange) {
			      if (!Number.isFinite(x)) {
			        throw makeException(TypeError, "is not a finite number", options);
			      }

			      x = integerPart(x);

			      if (x < lowerBound || x > upperBound) {
			        throw makeException(
			          TypeError,
			          `is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`,
			          options
			        );
			      }

			      return x;
			    }

			    if (!Number.isNaN(x) && options.clamp) {
			      x = Math.min(Math.max(x, lowerBound), upperBound);
			      x = evenRound(x);
			      return x;
			    }

			    if (!Number.isFinite(x) || x === 0) {
			      return 0;
			    }
			    x = integerPart(x);

			    // Math.pow(2, 64) is not accurately representable in JavaScript, so try to avoid these per-spec operations if
			    // possible. Hopefully it's an optimization for the non-64-bitLength cases too.
			    if (x >= lowerBound && x <= upperBound) {
			      return x;
			    }

			    // These will not work great for bitLength of 64, but oh well. See the README for more details.
			    x = modulo(x, twoToTheBitLength);
			    if (!unsigned && x >= twoToOneLessThanTheBitLength) {
			      return x - twoToTheBitLength;
			    }
			    return x;
			  };
			}

			function createLongLongConversion(bitLength, { unsigned }) {
			  const upperBound = Number.MAX_SAFE_INTEGER;
			  const lowerBound = unsigned ? 0 : Number.MIN_SAFE_INTEGER;
			  const asBigIntN = unsigned ? BigInt.asUintN : BigInt.asIntN;

			  return (value, options = {}) => {
			    let x = toNumber(value, options);
			    x = censorNegativeZero(x);

			    if (options.enforceRange) {
			      if (!Number.isFinite(x)) {
			        throw makeException(TypeError, "is not a finite number", options);
			      }

			      x = integerPart(x);

			      if (x < lowerBound || x > upperBound) {
			        throw makeException(
			          TypeError,
			          `is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`,
			          options
			        );
			      }

			      return x;
			    }

			    if (!Number.isNaN(x) && options.clamp) {
			      x = Math.min(Math.max(x, lowerBound), upperBound);
			      x = evenRound(x);
			      return x;
			    }

			    if (!Number.isFinite(x) || x === 0) {
			      return 0;
			    }

			    let xBigInt = BigInt(integerPart(x));
			    xBigInt = asBigIntN(bitLength, xBigInt);
			    return Number(xBigInt);
			  };
			}

			exports.any = value => {
			  return value;
			};

			exports.undefined = () => {
			  return undefined;
			};

			exports.boolean = value => {
			  return Boolean(value);
			};

			exports.byte = createIntegerConversion(8, { unsigned: false });
			exports.octet = createIntegerConversion(8, { unsigned: true });

			exports.short = createIntegerConversion(16, { unsigned: false });
			exports["unsigned short"] = createIntegerConversion(16, { unsigned: true });

			exports.long = createIntegerConversion(32, { unsigned: false });
			exports["unsigned long"] = createIntegerConversion(32, { unsigned: true });

			exports["long long"] = createLongLongConversion(64, { unsigned: false });
			exports["unsigned long long"] = createLongLongConversion(64, { unsigned: true });

			exports.double = (value, options = {}) => {
			  const x = toNumber(value, options);

			  if (!Number.isFinite(x)) {
			    throw makeException(TypeError, "is not a finite floating-point value", options);
			  }

			  return x;
			};

			exports["unrestricted double"] = (value, options = {}) => {
			  const x = toNumber(value, options);

			  return x;
			};

			exports.float = (value, options = {}) => {
			  const x = toNumber(value, options);

			  if (!Number.isFinite(x)) {
			    throw makeException(TypeError, "is not a finite floating-point value", options);
			  }

			  if (Object.is(x, -0)) {
			    return x;
			  }

			  const y = Math.fround(x);

			  if (!Number.isFinite(y)) {
			    throw makeException(TypeError, "is outside the range of a single-precision floating-point value", options);
			  }

			  return y;
			};

			exports["unrestricted float"] = (value, options = {}) => {
			  const x = toNumber(value, options);

			  if (isNaN(x)) {
			    return x;
			  }

			  if (Object.is(x, -0)) {
			    return x;
			  }

			  return Math.fround(x);
			};

			exports.DOMString = (value, options = {}) => {
			  if (options.treatNullAsEmptyString && value === null) {
			    return "";
			  }

			  if (typeof value === "symbol") {
			    throw makeException(TypeError, "is a symbol, which cannot be converted to a string", options);
			  }

			  const StringCtor = options.globals ? options.globals.String : String;
			  return StringCtor(value);
			};

			exports.ByteString = (value, options = {}) => {
			  const x = exports.DOMString(value, options);
			  let c;
			  for (let i = 0; (c = x.codePointAt(i)) !== undefined; ++i) {
			    if (c > 255) {
			      throw makeException(TypeError, "is not a valid ByteString", options);
			    }
			  }

			  return x;
			};

			exports.USVString = (value, options = {}) => {
			  const S = exports.DOMString(value, options);
			  const n = S.length;
			  const U = [];
			  for (let i = 0; i < n; ++i) {
			    const c = S.charCodeAt(i);
			    if (c < 0xD800 || c > 0xDFFF) {
			      U.push(String.fromCodePoint(c));
			    } else if (0xDC00 <= c && c <= 0xDFFF) {
			      U.push(String.fromCodePoint(0xFFFD));
			    } else if (i === n - 1) {
			      U.push(String.fromCodePoint(0xFFFD));
			    } else {
			      const d = S.charCodeAt(i + 1);
			      if (0xDC00 <= d && d <= 0xDFFF) {
			        const a = c & 0x3FF;
			        const b = d & 0x3FF;
			        U.push(String.fromCodePoint((2 << 15) + ((2 << 9) * a) + b));
			        ++i;
			      } else {
			        U.push(String.fromCodePoint(0xFFFD));
			      }
			    }
			  }

			  return U.join("");
			};

			exports.object = (value, options = {}) => {
			  if (value === null || (typeof value !== "object" && typeof value !== "function")) {
			    throw makeException(TypeError, "is not an object", options);
			  }

			  return value;
			};

			const abByteLengthGetter =
			    Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get;
			const sabByteLengthGetter =
			    typeof SharedArrayBuffer === "function" ?
			      Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength").get :
			      null;

			function isNonSharedArrayBuffer(value) {
			  try {
			    // This will throw on SharedArrayBuffers, but not detached ArrayBuffers.
			    // (The spec says it should throw, but the spec conflicts with implementations: https://github.com/tc39/ecma262/issues/678)
			    abByteLengthGetter.call(value);

			    return true;
			  } catch {
			    return false;
			  }
			}

			function isSharedArrayBuffer(value) {
			  try {
			    sabByteLengthGetter.call(value);
			    return true;
			  } catch {
			    return false;
			  }
			}

			function isArrayBufferDetached(value) {
			  try {
			    // eslint-disable-next-line no-new
			    new Uint8Array(value);
			    return false;
			  } catch {
			    return true;
			  }
			}

			exports.ArrayBuffer = (value, options = {}) => {
			  if (!isNonSharedArrayBuffer(value)) {
			    if (options.allowShared && !isSharedArrayBuffer(value)) {
			      throw makeException(TypeError, "is not an ArrayBuffer or SharedArrayBuffer", options);
			    }
			    throw makeException(TypeError, "is not an ArrayBuffer", options);
			  }
			  if (isArrayBufferDetached(value)) {
			    throw makeException(TypeError, "is a detached ArrayBuffer", options);
			  }

			  return value;
			};

			const dvByteLengthGetter =
			    Object.getOwnPropertyDescriptor(DataView.prototype, "byteLength").get;
			exports.DataView = (value, options = {}) => {
			  try {
			    dvByteLengthGetter.call(value);
			  } catch (e) {
			    throw makeException(TypeError, "is not a DataView", options);
			  }

			  if (!options.allowShared && isSharedArrayBuffer(value.buffer)) {
			    throw makeException(TypeError, "is backed by a SharedArrayBuffer, which is not allowed", options);
			  }
			  if (isArrayBufferDetached(value.buffer)) {
			    throw makeException(TypeError, "is backed by a detached ArrayBuffer", options);
			  }

			  return value;
			};

			// Returns the unforgeable `TypedArray` constructor name or `undefined`,
			// if the `this` value isn't a valid `TypedArray` object.
			//
			// https://tc39.es/ecma262/#sec-get-%typedarray%.prototype-@@tostringtag
			const typedArrayNameGetter = Object.getOwnPropertyDescriptor(
			  Object.getPrototypeOf(Uint8Array).prototype,
			  Symbol.toStringTag
			).get;
			[
			  Int8Array,
			  Int16Array,
			  Int32Array,
			  Uint8Array,
			  Uint16Array,
			  Uint32Array,
			  Uint8ClampedArray,
			  Float32Array,
			  Float64Array
			].forEach(func => {
			  const { name } = func;
			  const article = /^[AEIOU]/u.test(name) ? "an" : "a";
			  exports[name] = (value, options = {}) => {
			    if (!ArrayBuffer.isView(value) || typedArrayNameGetter.call(value) !== name) {
			      throw makeException(TypeError, `is not ${article} ${name} object`, options);
			    }
			    if (!options.allowShared && isSharedArrayBuffer(value.buffer)) {
			      throw makeException(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", options);
			    }
			    if (isArrayBufferDetached(value.buffer)) {
			      throw makeException(TypeError, "is a view on a detached ArrayBuffer", options);
			    }

			    return value;
			  };
			});

			// Common definitions

			exports.ArrayBufferView = (value, options = {}) => {
			  if (!ArrayBuffer.isView(value)) {
			    throw makeException(TypeError, "is not a view on an ArrayBuffer or SharedArrayBuffer", options);
			  }

			  if (!options.allowShared && isSharedArrayBuffer(value.buffer)) {
			    throw makeException(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", options);
			  }

			  if (isArrayBufferDetached(value.buffer)) {
			    throw makeException(TypeError, "is a view on a detached ArrayBuffer", options);
			  }
			  return value;
			};

			exports.BufferSource = (value, options = {}) => {
			  if (ArrayBuffer.isView(value)) {
			    if (!options.allowShared && isSharedArrayBuffer(value.buffer)) {
			      throw makeException(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", options);
			    }

			    if (isArrayBufferDetached(value.buffer)) {
			      throw makeException(TypeError, "is a view on a detached ArrayBuffer", options);
			    }
			    return value;
			  }

			  if (!options.allowShared && !isNonSharedArrayBuffer(value)) {
			    throw makeException(TypeError, "is not an ArrayBuffer or a view on one", options);
			  }
			  if (options.allowShared && !isSharedArrayBuffer(value) && !isNonSharedArrayBuffer(value)) {
			    throw makeException(TypeError, "is not an ArrayBuffer, SharedArrayBuffer, or a view on one", options);
			  }
			  if (isArrayBufferDetached(value)) {
			    throw makeException(TypeError, "is a detached ArrayBuffer", options);
			  }

			  return value;
			};

			exports.DOMTimeStamp = exports["unsigned long long"]; 
		} (lib$1));
		return lib$1;
	}

	var utils = {exports: {}};

	var hasRequiredUtils;

	function requireUtils () {
		if (hasRequiredUtils) return utils.exports;
		hasRequiredUtils = 1;
		(function (module, exports) {

			// Returns "Type(value) is Object" in ES terminology.
			function isObject(value) {
			  return (typeof value === "object" && value !== null) || typeof value === "function";
			}

			const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);

			// Like `Object.assign`, but using `[[GetOwnProperty]]` and `[[DefineOwnProperty]]`
			// instead of `[[Get]]` and `[[Set]]` and only allowing objects
			function define(target, source) {
			  for (const key of Reflect.ownKeys(source)) {
			    const descriptor = Reflect.getOwnPropertyDescriptor(source, key);
			    if (descriptor && !Reflect.defineProperty(target, key, descriptor)) {
			      throw new TypeError(`Cannot redefine property: ${String(key)}`);
			    }
			  }
			}

			function newObjectInRealm(globalObject, object) {
			  const ctorRegistry = initCtorRegistry(globalObject);
			  return Object.defineProperties(
			    Object.create(ctorRegistry["%Object.prototype%"]),
			    Object.getOwnPropertyDescriptors(object)
			  );
			}

			const wrapperSymbol = Symbol("wrapper");
			const implSymbol = Symbol("impl");
			const sameObjectCaches = Symbol("SameObject caches");
			const ctorRegistrySymbol = Symbol.for("[webidl2js] constructor registry");

			const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {}).prototype);

			function initCtorRegistry(globalObject) {
			  if (hasOwn(globalObject, ctorRegistrySymbol)) {
			    return globalObject[ctorRegistrySymbol];
			  }

			  const ctorRegistry = Object.create(null);

			  // In addition to registering all the WebIDL2JS-generated types in the constructor registry,
			  // we also register a few intrinsics that we make use of in generated code, since they are not
			  // easy to grab from the globalObject variable.
			  ctorRegistry["%Object.prototype%"] = globalObject.Object.prototype;
			  ctorRegistry["%IteratorPrototype%"] = Object.getPrototypeOf(
			    Object.getPrototypeOf(new globalObject.Array()[Symbol.iterator]())
			  );

			  try {
			    ctorRegistry["%AsyncIteratorPrototype%"] = Object.getPrototypeOf(
			      Object.getPrototypeOf(
			        globalObject.eval("(async function* () {})").prototype
			      )
			    );
			  } catch {
			    ctorRegistry["%AsyncIteratorPrototype%"] = AsyncIteratorPrototype;
			  }

			  globalObject[ctorRegistrySymbol] = ctorRegistry;
			  return ctorRegistry;
			}

			function getSameObject(wrapper, prop, creator) {
			  if (!wrapper[sameObjectCaches]) {
			    wrapper[sameObjectCaches] = Object.create(null);
			  }

			  if (prop in wrapper[sameObjectCaches]) {
			    return wrapper[sameObjectCaches][prop];
			  }

			  wrapper[sameObjectCaches][prop] = creator();
			  return wrapper[sameObjectCaches][prop];
			}

			function wrapperForImpl(impl) {
			  return impl ? impl[wrapperSymbol] : null;
			}

			function implForWrapper(wrapper) {
			  return wrapper ? wrapper[implSymbol] : null;
			}

			function tryWrapperForImpl(impl) {
			  const wrapper = wrapperForImpl(impl);
			  return wrapper ? wrapper : impl;
			}

			function tryImplForWrapper(wrapper) {
			  const impl = implForWrapper(wrapper);
			  return impl ? impl : wrapper;
			}

			const iterInternalSymbol = Symbol("internal");

			function isArrayIndexPropName(P) {
			  if (typeof P !== "string") {
			    return false;
			  }
			  const i = P >>> 0;
			  if (i === 2 ** 32 - 1) {
			    return false;
			  }
			  const s = `${i}`;
			  if (P !== s) {
			    return false;
			  }
			  return true;
			}

			const byteLengthGetter =
			    Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get;
			function isArrayBuffer(value) {
			  try {
			    byteLengthGetter.call(value);
			    return true;
			  } catch (e) {
			    return false;
			  }
			}

			function iteratorResult([key, value], kind) {
			  let result;
			  switch (kind) {
			    case "key":
			      result = key;
			      break;
			    case "value":
			      result = value;
			      break;
			    case "key+value":
			      result = [key, value];
			      break;
			  }
			  return { value: result, done: false };
			}

			const supportsPropertyIndex = Symbol("supports property index");
			const supportedPropertyIndices = Symbol("supported property indices");
			const supportsPropertyName = Symbol("supports property name");
			const supportedPropertyNames = Symbol("supported property names");
			const indexedGet = Symbol("indexed property get");
			const indexedSetNew = Symbol("indexed property set new");
			const indexedSetExisting = Symbol("indexed property set existing");
			const namedGet = Symbol("named property get");
			const namedSetNew = Symbol("named property set new");
			const namedSetExisting = Symbol("named property set existing");
			const namedDelete = Symbol("named property delete");

			const asyncIteratorNext = Symbol("async iterator get the next iteration result");
			const asyncIteratorReturn = Symbol("async iterator return steps");
			const asyncIteratorInit = Symbol("async iterator initialization steps");
			const asyncIteratorEOI = Symbol("async iterator end of iteration");

			module.exports = {
			  isObject,
			  hasOwn,
			  define,
			  newObjectInRealm,
			  wrapperSymbol,
			  implSymbol,
			  getSameObject,
			  ctorRegistrySymbol,
			  initCtorRegistry,
			  wrapperForImpl,
			  implForWrapper,
			  tryWrapperForImpl,
			  tryImplForWrapper,
			  iterInternalSymbol,
			  isArrayBuffer,
			  isArrayIndexPropName,
			  supportsPropertyIndex,
			  supportedPropertyIndices,
			  supportsPropertyName,
			  supportedPropertyNames,
			  indexedGet,
			  indexedSetNew,
			  indexedSetExisting,
			  namedGet,
			  namedSetNew,
			  namedSetExisting,
			  namedDelete,
			  asyncIteratorNext,
			  asyncIteratorReturn,
			  asyncIteratorInit,
			  asyncIteratorEOI,
			  iteratorResult
			}; 
		} (utils));
		return utils.exports;
	}

	var DOMExceptionImpl = {};

	var IndexSizeError = 1;
	var HierarchyRequestError = 3;
	var WrongDocumentError = 4;
	var InvalidCharacterError = 5;
	var NoModificationAllowedError = 7;
	var NotFoundError = 8;
	var NotSupportedError = 9;
	var InUseAttributeError = 10;
	var InvalidStateError = 11;
	var InvalidModificationError = 13;
	var NamespaceError = 14;
	var InvalidAccessError = 15;
	var TypeMismatchError = 17;
	var SecurityError = 18;
	var NetworkError = 19;
	var AbortError = 20;
	var URLMismatchError = 21;
	var QuotaExceededError = 22;
	var TimeoutError = 23;
	var InvalidNodeTypeError = 24;
	var DataCloneError = 25;
	var require$$0 = {
		IndexSizeError: IndexSizeError,
		HierarchyRequestError: HierarchyRequestError,
		WrongDocumentError: WrongDocumentError,
		InvalidCharacterError: InvalidCharacterError,
		NoModificationAllowedError: NoModificationAllowedError,
		NotFoundError: NotFoundError,
		NotSupportedError: NotSupportedError,
		InUseAttributeError: InUseAttributeError,
		InvalidStateError: InvalidStateError,
		"SyntaxError": 12,
		InvalidModificationError: InvalidModificationError,
		NamespaceError: NamespaceError,
		InvalidAccessError: InvalidAccessError,
		TypeMismatchError: TypeMismatchError,
		SecurityError: SecurityError,
		NetworkError: NetworkError,
		AbortError: AbortError,
		URLMismatchError: URLMismatchError,
		QuotaExceededError: QuotaExceededError,
		TimeoutError: TimeoutError,
		InvalidNodeTypeError: InvalidNodeTypeError,
		DataCloneError: DataCloneError
	};

	var hasRequiredDOMExceptionImpl;

	function requireDOMExceptionImpl () {
		if (hasRequiredDOMExceptionImpl) return DOMExceptionImpl;
		hasRequiredDOMExceptionImpl = 1;
		const legacyErrorCodes = require$$0;
		const idlUtils = requireUtils();

		DOMExceptionImpl.implementation = class DOMExceptionImpl {
		  constructor(globalObject, [message, name]) {
		    this.name = name;
		    this.message = message;
		  }

		  get code() {
		    return legacyErrorCodes[this.name] || 0;
		  }
		};

		// A proprietary V8 extension that causes the stack property to appear.
		DOMExceptionImpl.init = impl => {
		  if (Error.captureStackTrace) {
		    const wrapper = idlUtils.wrapperForImpl(impl);
		    Error.captureStackTrace(wrapper, wrapper.constructor);
		  }
		};
		return DOMExceptionImpl;
	}

	var hasRequiredDOMException;

	function requireDOMException () {
		if (hasRequiredDOMException) return DOMException;
		hasRequiredDOMException = 1;
		(function (exports) {

			const conversions = requireLib$1();
			const utils = requireUtils();

			const implSymbol = utils.implSymbol;
			const ctorRegistrySymbol = utils.ctorRegistrySymbol;

			const interfaceName = "DOMException";

			exports.is = value => {
			  return utils.isObject(value) && utils.hasOwn(value, implSymbol) && value[implSymbol] instanceof Impl.implementation;
			};
			exports.isImpl = value => {
			  return utils.isObject(value) && value instanceof Impl.implementation;
			};
			exports.convert = (globalObject, value, { context = "The provided value" } = {}) => {
			  if (exports.is(value)) {
			    return utils.implForWrapper(value);
			  }
			  throw new globalObject.TypeError(`${context} is not of type 'DOMException'.`);
			};

			function makeWrapper(globalObject, newTarget) {
			  let proto;
			  if (newTarget !== undefined) {
			    proto = newTarget.prototype;
			  }

			  if (!utils.isObject(proto)) {
			    proto = globalObject[ctorRegistrySymbol]["DOMException"].prototype;
			  }

			  return Object.create(proto);
			}

			exports.create = (globalObject, constructorArgs, privateData) => {
			  const wrapper = makeWrapper(globalObject);
			  return exports.setup(wrapper, globalObject, constructorArgs, privateData);
			};

			exports.createImpl = (globalObject, constructorArgs, privateData) => {
			  const wrapper = exports.create(globalObject, constructorArgs, privateData);
			  return utils.implForWrapper(wrapper);
			};

			exports._internalSetup = (wrapper, globalObject) => {};

			exports.setup = (wrapper, globalObject, constructorArgs = [], privateData = {}) => {
			  privateData.wrapper = wrapper;

			  exports._internalSetup(wrapper, globalObject);
			  Object.defineProperty(wrapper, implSymbol, {
			    value: new Impl.implementation(globalObject, constructorArgs, privateData),
			    configurable: true
			  });

			  wrapper[implSymbol][utils.wrapperSymbol] = wrapper;
			  if (Impl.init) {
			    Impl.init(wrapper[implSymbol]);
			  }
			  return wrapper;
			};

			exports.new = (globalObject, newTarget) => {
			  const wrapper = makeWrapper(globalObject, newTarget);

			  exports._internalSetup(wrapper, globalObject);
			  Object.defineProperty(wrapper, implSymbol, {
			    value: Object.create(Impl.implementation.prototype),
			    configurable: true
			  });

			  wrapper[implSymbol][utils.wrapperSymbol] = wrapper;
			  if (Impl.init) {
			    Impl.init(wrapper[implSymbol]);
			  }
			  return wrapper[implSymbol];
			};

			const exposed = new Set(["Window", "Worker"]);

			exports.install = (globalObject, globalNames) => {
			  if (!globalNames.some(globalName => exposed.has(globalName))) {
			    return;
			  }

			  const ctorRegistry = utils.initCtorRegistry(globalObject);
			  class DOMException {
			    constructor() {
			      const args = [];
			      {
			        let curArg = arguments[0];
			        if (curArg !== undefined) {
			          curArg = conversions["DOMString"](curArg, {
			            context: "Failed to construct 'DOMException': parameter 1",
			            globals: globalObject
			          });
			        } else {
			          curArg = "";
			        }
			        args.push(curArg);
			      }
			      {
			        let curArg = arguments[1];
			        if (curArg !== undefined) {
			          curArg = conversions["DOMString"](curArg, {
			            context: "Failed to construct 'DOMException': parameter 2",
			            globals: globalObject
			          });
			        } else {
			          curArg = "Error";
			        }
			        args.push(curArg);
			      }
			      return exports.setup(Object.create(new.target.prototype), globalObject, args);
			    }

			    get name() {
			      const esValue = this !== null && this !== undefined ? this : globalObject;

			      if (!exports.is(esValue)) {
			        throw new globalObject.TypeError(
			          "'get name' called on an object that is not a valid instance of DOMException."
			        );
			      }

			      return esValue[implSymbol]["name"];
			    }

			    get message() {
			      const esValue = this !== null && this !== undefined ? this : globalObject;

			      if (!exports.is(esValue)) {
			        throw new globalObject.TypeError(
			          "'get message' called on an object that is not a valid instance of DOMException."
			        );
			      }

			      return esValue[implSymbol]["message"];
			    }

			    get code() {
			      const esValue = this !== null && this !== undefined ? this : globalObject;

			      if (!exports.is(esValue)) {
			        throw new globalObject.TypeError(
			          "'get code' called on an object that is not a valid instance of DOMException."
			        );
			      }

			      return esValue[implSymbol]["code"];
			    }
			  }
			  Object.defineProperties(DOMException.prototype, {
			    name: { enumerable: true },
			    message: { enumerable: true },
			    code: { enumerable: true },
			    [Symbol.toStringTag]: { value: "DOMException", configurable: true },
			    INDEX_SIZE_ERR: { value: 1, enumerable: true },
			    DOMSTRING_SIZE_ERR: { value: 2, enumerable: true },
			    HIERARCHY_REQUEST_ERR: { value: 3, enumerable: true },
			    WRONG_DOCUMENT_ERR: { value: 4, enumerable: true },
			    INVALID_CHARACTER_ERR: { value: 5, enumerable: true },
			    NO_DATA_ALLOWED_ERR: { value: 6, enumerable: true },
			    NO_MODIFICATION_ALLOWED_ERR: { value: 7, enumerable: true },
			    NOT_FOUND_ERR: { value: 8, enumerable: true },
			    NOT_SUPPORTED_ERR: { value: 9, enumerable: true },
			    INUSE_ATTRIBUTE_ERR: { value: 10, enumerable: true },
			    INVALID_STATE_ERR: { value: 11, enumerable: true },
			    SYNTAX_ERR: { value: 12, enumerable: true },
			    INVALID_MODIFICATION_ERR: { value: 13, enumerable: true },
			    NAMESPACE_ERR: { value: 14, enumerable: true },
			    INVALID_ACCESS_ERR: { value: 15, enumerable: true },
			    VALIDATION_ERR: { value: 16, enumerable: true },
			    TYPE_MISMATCH_ERR: { value: 17, enumerable: true },
			    SECURITY_ERR: { value: 18, enumerable: true },
			    NETWORK_ERR: { value: 19, enumerable: true },
			    ABORT_ERR: { value: 20, enumerable: true },
			    URL_MISMATCH_ERR: { value: 21, enumerable: true },
			    QUOTA_EXCEEDED_ERR: { value: 22, enumerable: true },
			    TIMEOUT_ERR: { value: 23, enumerable: true },
			    INVALID_NODE_TYPE_ERR: { value: 24, enumerable: true },
			    DATA_CLONE_ERR: { value: 25, enumerable: true }
			  });
			  Object.defineProperties(DOMException, {
			    INDEX_SIZE_ERR: { value: 1, enumerable: true },
			    DOMSTRING_SIZE_ERR: { value: 2, enumerable: true },
			    HIERARCHY_REQUEST_ERR: { value: 3, enumerable: true },
			    WRONG_DOCUMENT_ERR: { value: 4, enumerable: true },
			    INVALID_CHARACTER_ERR: { value: 5, enumerable: true },
			    NO_DATA_ALLOWED_ERR: { value: 6, enumerable: true },
			    NO_MODIFICATION_ALLOWED_ERR: { value: 7, enumerable: true },
			    NOT_FOUND_ERR: { value: 8, enumerable: true },
			    NOT_SUPPORTED_ERR: { value: 9, enumerable: true },
			    INUSE_ATTRIBUTE_ERR: { value: 10, enumerable: true },
			    INVALID_STATE_ERR: { value: 11, enumerable: true },
			    SYNTAX_ERR: { value: 12, enumerable: true },
			    INVALID_MODIFICATION_ERR: { value: 13, enumerable: true },
			    NAMESPACE_ERR: { value: 14, enumerable: true },
			    INVALID_ACCESS_ERR: { value: 15, enumerable: true },
			    VALIDATION_ERR: { value: 16, enumerable: true },
			    TYPE_MISMATCH_ERR: { value: 17, enumerable: true },
			    SECURITY_ERR: { value: 18, enumerable: true },
			    NETWORK_ERR: { value: 19, enumerable: true },
			    ABORT_ERR: { value: 20, enumerable: true },
			    URL_MISMATCH_ERR: { value: 21, enumerable: true },
			    QUOTA_EXCEEDED_ERR: { value: 22, enumerable: true },
			    TIMEOUT_ERR: { value: 23, enumerable: true },
			    INVALID_NODE_TYPE_ERR: { value: 24, enumerable: true },
			    DATA_CLONE_ERR: { value: 25, enumerable: true }
			  });
			  ctorRegistry[interfaceName] = DOMException;

			  Object.defineProperty(globalObject, interfaceName, {
			    configurable: true,
			    writable: true,
			    value: DOMException
			  });
			};

			const Impl = requireDOMExceptionImpl(); 
		} (DOMException));
		return DOMException;
	}

	var webidl2jsWrapper;
	var hasRequiredWebidl2jsWrapper;

	function requireWebidl2jsWrapper () {
		if (hasRequiredWebidl2jsWrapper) return webidl2jsWrapper;
		hasRequiredWebidl2jsWrapper = 1;
		const DOMException = requireDOMException();

		// Special install function to make the DOMException inherit from Error.
		// https://heycam.github.io/webidl/#es-DOMException-specialness
		function installOverride(globalObject, globalNames) {
		  if (typeof globalObject.Error !== "function") {
		    throw new Error("Internal error: Error constructor is not present on the given global object.");
		  }

		  DOMException.install(globalObject, globalNames);
		  Object.setPrototypeOf(globalObject.DOMException.prototype, globalObject.Error.prototype);
		}

		webidl2jsWrapper = { ...DOMException, install: installOverride };
		return webidl2jsWrapper;
	}

	var domexception;
	var hasRequiredDomexception;

	function requireDomexception () {
		if (hasRequiredDomexception) return domexception;
		hasRequiredDomexception = 1;
		const DOMException = requireWebidl2jsWrapper();

		const sharedGlobalObject = { Array, Error, Object, Promise, String, TypeError };
		DOMException.install(sharedGlobalObject, ["Window"]);

		domexception = sharedGlobalObject.DOMException;
		return domexception;
	}

	var datachannelevent;
	var hasRequiredDatachannelevent;

	function requireDatachannelevent () {
		if (hasRequiredDatachannelevent) return datachannelevent;
		hasRequiredDatachannelevent = 1;

		function RTCDataChannelEvent(type, eventInitDict) {
		  Object.defineProperties(this, {
		    bubbles: {
		      value: false
		    },
		    cancelable: {
		      value: false
		    },
		    type: {
		      value: type,
		      enumerable: true
		    },
		    channel: {
		      value: eventInitDict.channel,
		      enumerable: true
		    },
		    target: {
		      value: eventInitDict.target,
		      enumerable: true
		    }
		  });
		}

		datachannelevent = RTCDataChannelEvent;
		return datachannelevent;
	}

	var icecandidate;
	var hasRequiredIcecandidate;

	function requireIcecandidate () {
		if (hasRequiredIcecandidate) return icecandidate;
		hasRequiredIcecandidate = 1;

		function RTCIceCandidate(candidateInitDict) {
		  [
		    'candidate',
		    'sdpMid',
		    'sdpMLineIndex',
		    'foundation',
		    'component',
		    'priority',
		    'address',
		    'protocol',
		    'port',
		    'type',
		    'tcpType',
		    'relatedAddress',
		    'relatedPort',
		    'usernameFragment'
		  ].forEach(property => {
		    if (candidateInitDict && property in candidateInitDict) {
		      this[property] = candidateInitDict[property];
		    } else {
		      this[property] = null;
		    }
		  });

		  this.toJSON = () => {
		    const { candidate, sdpMid, sdpMLineIndex, usernameFragment } = this;
		    let json = {
		      candidate,
		      sdpMid,
		      sdpMLineIndex
		    };

		    if (usernameFragment) {
		      json.usernameFragment = usernameFragment;
		    }

		    return json;
		  };
		}

		icecandidate = RTCIceCandidate;
		return icecandidate;
	}

	var rtcpeerconnectioniceevent;
	var hasRequiredRtcpeerconnectioniceevent;

	function requireRtcpeerconnectioniceevent () {
		if (hasRequiredRtcpeerconnectioniceevent) return rtcpeerconnectioniceevent;
		hasRequiredRtcpeerconnectioniceevent = 1;

		function RTCPeerConnectionIceEvent(type, eventInitDict) {
		  Object.defineProperties(this, {
		    type: {
		      value: type,
		      enumerable: true
		    },
		    candidate: {
		      value: eventInitDict.candidate,
		      enumerable: true
		    },
		    target: {
		      value: eventInitDict.target,
		      enumerable: true
		    }
		  });
		}

		rtcpeerconnectioniceevent = RTCPeerConnectionIceEvent;
		return rtcpeerconnectioniceevent;
	}

	var rtcpeerconnectioniceerrorevent;
	var hasRequiredRtcpeerconnectioniceerrorevent;

	function requireRtcpeerconnectioniceerrorevent () {
		if (hasRequiredRtcpeerconnectioniceerrorevent) return rtcpeerconnectioniceerrorevent;
		hasRequiredRtcpeerconnectioniceerrorevent = 1;

		function RTCPeerConnectionIceErrorEvent(type, eventInitDict) {
		  Object.defineProperties(this, {
		    type: {
		      value: type,
		      enumerable: true
		    },
		    address: {
		      value: eventInitDict.address,
		      enumerable: true
		    },
		    port: {
		      value: eventInitDict.port,
		      enumerable: true
		    },
		    url: {
		      value: eventInitDict.url,
		      enumerable: true
		    },
		    errorCode: {
		      value: eventInitDict.errorCode,
		      enumerable: true
		    },
		    errorText: {
		      value: eventInitDict.errorText,
		      enumerable: true
		    },
		    target: {
		      value: eventInitDict.target,
		      enumerable: true
		    }
		  });
		}

		rtcpeerconnectioniceerrorevent = RTCPeerConnectionIceErrorEvent;
		return rtcpeerconnectioniceerrorevent;
	}

	var sessiondescription;
	var hasRequiredSessiondescription;

	function requireSessiondescription () {
		if (hasRequiredSessiondescription) return sessiondescription;
		hasRequiredSessiondescription = 1;

		function RTCSessionDescription(descriptionInitDict) {
		  if (descriptionInitDict) {
		    this.type = descriptionInitDict.type;
		    this.sdp = descriptionInitDict.sdp;
		  }

		  this.toJSON = () => {
		    const { sdp, type } = this;

		    return {
		      sdp,
		      type
		    };
		  };
		}

		sessiondescription = RTCSessionDescription;
		return sessiondescription;
	}

	var peerconnection;
	var hasRequiredPeerconnection;

	function requirePeerconnection () {
		if (hasRequiredPeerconnection) return peerconnection;
		hasRequiredPeerconnection = 1;

		var inherits = require$$0$3.inherits;

		var _webrtc = requireBinding();

		var EventTarget = requireEventtarget();

		var RTCDataChannelEvent = requireDatachannelevent();
		var RTCIceCandidate = requireIcecandidate();
		var RTCPeerConnectionIceEvent = requireRtcpeerconnectioniceevent();
		var RTCPeerConnectionIceErrorEvent = requireRtcpeerconnectioniceerrorevent();
		var RTCSessionDescription = requireSessiondescription();

		function RTCPeerConnection() {
		  var self = this;
		  var pc = new _webrtc.RTCPeerConnection(arguments[0] || {});

		  EventTarget.call(this);

		  //
		  // Attach events to the native PeerConnection object
		  //
		  pc.ontrack = function ontrack(receiver, streams, transceiver) {
		    self.dispatchEvent({
		      type: 'track',
		      track: receiver.track,
		      receiver: receiver,
		      streams: streams,
		      transceiver: transceiver,
		      target: self
		    });
		  };

		  pc.onconnectionstatechange = function onconnectionstatechange() {
		    self.dispatchEvent({ type: 'connectionstatechange', target: self });
		  };

		  pc.onicecandidate = function onicecandidate(candidate) {
		    var icecandidate = new RTCIceCandidate(candidate);
		    self.dispatchEvent(new RTCPeerConnectionIceEvent('icecandidate', { candidate: icecandidate, target: self }));
		  };

		  pc.onicecandidateerror = function onicecandidateerror(eventInitDict) {
		    var pair = eventInitDict.hostCandidate.split(':');
		    eventInitDict.address = pair[0];
		    eventInitDict.port = pair[1];
		    eventInitDict.target = self;
		    var icecandidateerror = new RTCPeerConnectionIceErrorEvent('icecandidateerror', eventInitDict);
		    self.dispatchEvent(icecandidateerror);
		  };

		  pc.onsignalingstatechange = function onsignalingstatechange() {
		    self.dispatchEvent({ type: 'signalingstatechange', target: self });
		  };

		  pc.oniceconnectionstatechange = function oniceconnectionstatechange() {
		    self.dispatchEvent({ type: 'iceconnectionstatechange', target: self });
		  };

		  pc.onicegatheringstatechange = function onicegatheringstatechange() {
		    self.dispatchEvent({ type: 'icegatheringstatechange', target: self });

		    // if we have completed gathering candidates, trigger a null candidate event
		    if (self.iceGatheringState === 'complete' && self.connectionState !== 'closed') {
		      self.dispatchEvent(new RTCPeerConnectionIceEvent('icecandidate', { candidate: null, target: self }));
		    }
		  };

		  pc.onnegotiationneeded = function onnegotiationneeded() {
		    self.dispatchEvent({ type: 'negotiationneeded', target: self });
		  };

		  // [ToDo] onnegotiationneeded

		  pc.ondatachannel = function ondatachannel(channel) {
		    self.dispatchEvent(new RTCDataChannelEvent('datachannel', { channel, target: self }));
		  };

		  //
		  // PeerConnection properties & attributes
		  //

		  Object.defineProperties(this, {
		    _pc: {
		      value: pc
		    },
		    canTrickleIceCandidates: {
		      get: function getCanTrickleIceCandidates() {
		        return pc.canTrickleIceCandidates;
		      },
		      enumerable: true
		    },
		    connectionState: {
		      get: function getConnectionState() {
		        return pc.connectionState;
		      },
		      enumerable: true
		    },
		    currentLocalDescription: {
		      get: function getCurrentLocalDescription() {
		        return pc.currentLocalDescription
		          ? new RTCSessionDescription(pc.currentLocalDescription)
		          : null;
		      },
		      enumerable: true
		    },
		    localDescription: {
		      get: function getLocalDescription() {
		        return pc.localDescription
		          ? new RTCSessionDescription(pc.localDescription)
		          : null;
		      },
		      enumerable: true
		    },
		    pendingLocalDescription: {
		      get: function getPendingLocalDescription() {
		        return pc.pendingLocalDescription
		          ? new RTCSessionDescription(pc.pendingLocalDescription)
		          : null;
		      },
		      enumerable: true
		    },
		    currentRemoteDescription: {
		      get: function getCurrentRemoteDescription() {
		        return pc.currentRemoteDescription
		          ? new RTCSessionDescription(pc.currentRemoteDescription)
		          : null;
		      },
		      enumerable: true
		    },
		    remoteDescription: {
		      get: function getRemoteDescription() {
		        return pc.remoteDescription
		          ? new RTCSessionDescription(pc.remoteDescription)
		          : null;
		      },
		      enumerable: true
		    },
		    pendingRemoteDescription: {
		      get: function getPendingRemoteDescription() {
		        return pc.pendingRemoteDescription
		          ? new RTCSessionDescription(pc.pendingRemoteDescription)
		          : null;
		      },
		      enumerable: true
		    },
		    signalingState: {
		      get: function getSignalingState() {
		        return pc.signalingState;
		      },
		      enumerable: true
		    },
		    readyState: {
		      get: function getReadyState() {
		        return pc.getReadyState();
		      }
		    },
		    sctp: {
		      get: function() {
		        return pc.sctp;
		      },
		      enumerable: true
		    },
		    iceGatheringState: {
		      get: function getIceGatheringState() {
		        return pc.iceGatheringState;
		      },
		      enumerable: true
		    },
		    iceConnectionState: {
		      get: function getIceConnectionState() {
		        return pc.iceConnectionState;
		      },
		      enumerable: true
		    },
		    onconnectionstatechange: {
		      value: null,
		      writable: true,
		      enumerable: true
		    },
		    ondatachannel: {
		      value: null,
		      writable: true,
		      enumerable: true
		    },
		    oniceconnectionstatechange: {
		      value: null,
		      writable: true,
		      enumerable: true
		    },
		    onicegatheringstatechange: {
		      value: null,
		      writable: true,
		      enumerable: true
		    },
		    onnegotiationneeded: {
		      value: null,
		      writable: true,
		      enumerable: true
		    },
		    onsignalingstatechange: {
		      value: null,
		      writable: true,
		      enumerable: true
		    }
		  });
		}

		inherits(RTCPeerConnection, EventTarget);

		// NOTE(mroberts): This is a bit of a hack.
		RTCPeerConnection.prototype.ontrack = null;

		RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate(candidate) {
		  var promise = this._pc.addIceCandidate(candidate);
		  if (arguments.length === 3) {
		    promise.then(arguments[1], arguments[2]);
		  }
		  return promise;
		};

		RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
		  return this._pc.addTransceiver.apply(this._pc, arguments);
		};

		RTCPeerConnection.prototype.addTrack = function addTrack(track, ...streams) {
		  return this._pc.addTrack(track, streams);
		};

		RTCPeerConnection.prototype.close = function close() {
		  this._pc.close();
		};

		RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
		  return this._pc.createDataChannel.apply(this._pc, arguments);
		};

		RTCPeerConnection.prototype.createOffer = function createOffer() {
		  var options = arguments.length === 3
		    ? arguments[2]
		    : arguments[0];
		  var promise = this._pc.createOffer(options || {});
		  if (arguments.length >= 2) {
		    promise.then(arguments[0], arguments[1]);
		  }
		  return promise;
		};

		RTCPeerConnection.prototype.createAnswer = function createAnswer() {
		  var options = arguments.length === 3
		    ? arguments[2]
		    : arguments[0];
		  var promise = this._pc.createAnswer(options || {});
		  if (arguments.length >= 2) {
		    promise.then(arguments[0], arguments[1]);
		  }
		  return promise;
		};

		RTCPeerConnection.prototype.getConfiguration = function getConfiguration() {
		  return this._pc.getConfiguration();
		};

		RTCPeerConnection.prototype.getReceivers = function getReceivers() {
		  return this._pc.getReceivers();
		};

		RTCPeerConnection.prototype.getSenders = function getSenders() {
		  return this._pc.getSenders();
		};

		RTCPeerConnection.prototype.getTransceivers = function getTransceivers() {
		  return this._pc.getTransceivers();
		};

		RTCPeerConnection.prototype.getStats = function getStats() {
		  return this._pc.getStats(arguments[0]);
		};

		RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
		  this._pc.removeTrack(sender);
		};

		RTCPeerConnection.prototype.setConfiguration = function setConfiguration(configuration) {
		  return this._pc.setConfiguration(configuration);
		};

		RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription(description) {
		  var promise = this._pc.setLocalDescription(description);
		  if (arguments.length === 3) {
		    promise.then(arguments[1], arguments[2]);
		  }
		  return promise;
		};

		RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(description) {
		  var promise = this._pc.setRemoteDescription(description);
		  if (arguments.length === 3) {
		    promise.then(arguments[1], arguments[2]);
		  }
		  return promise;
		};

		RTCPeerConnection.prototype.restartIce = function restartIce() {
		  return this._pc.restartIce();
		};

		peerconnection = RTCPeerConnection;
		return peerconnection;
	}

	var lib;
	var hasRequiredLib;

	function requireLib () {
		if (hasRequiredLib) return lib;
		hasRequiredLib = 1;

		const { inherits } = require$$0$3;

		const {
		  MediaStream,
		  MediaStreamTrack,
		  RTCAudioSink,
		  RTCAudioSource,
		  RTCDataChannel,
		  RTCDtlsTransport,
		  RTCIceTransport,
		  RTCRtpReceiver,
		  RTCRtpSender,
		  RTCRtpTransceiver,
		  RTCSctpTransport,
		  RTCVideoSink,
		  RTCVideoSource,
		  getUserMedia,
		  i420ToRgba,
		  rgbaToI420,
		  setDOMException
		} = requireBinding();

		const EventTarget = requireEventtarget();
		const MediaDevices = requireMediadevices();

		inherits(MediaStream, EventTarget);
		inherits(MediaStreamTrack, EventTarget);
		inherits(RTCAudioSink, EventTarget);
		inherits(RTCDataChannel, EventTarget);
		inherits(RTCDtlsTransport, EventTarget);
		inherits(RTCIceTransport, EventTarget);
		inherits(RTCSctpTransport, EventTarget);
		inherits(RTCVideoSink, EventTarget);

		try {
		  setDOMException(requireDomexception());
		} catch (error) {
		  // Do nothing
		}

		// NOTE(mroberts): Here's a hack to support jsdom's Blob implementation.
		RTCDataChannel.prototype.send = function send(data) {
		  const implSymbol = Object.getOwnPropertySymbols(data).find(symbol => symbol.toString() === 'Symbol(impl)');
		  if (data[implSymbol] && data[implSymbol]._buffer) {
		    data = data[implSymbol]._buffer;
		  }
		  this._send(data);
		};

		const mediaDevices = new MediaDevices();

		const nonstandard = {
		  i420ToRgba,
		  RTCAudioSink,
		  RTCAudioSource,
		  RTCVideoSink,
		  RTCVideoSource,
		  rgbaToI420
		};

		lib = {
		  MediaStream,
		  MediaStreamTrack,
		  RTCDataChannel,
		  RTCDataChannelEvent: requireDatachannelevent(),
		  RTCDtlsTransport,
		  RTCIceCandidate: requireIcecandidate(),
		  RTCIceTransport,
		  RTCPeerConnection: requirePeerconnection(),
		  RTCPeerConnectionIceEvent: requireRtcpeerconnectioniceevent(),
		  RTCRtpReceiver,
		  RTCRtpSender,
		  RTCRtpTransceiver,
		  RTCSctpTransport,
		  RTCSessionDescription: requireSessiondescription(),
		  getUserMedia,
		  mediaDevices,
		  nonstandard,
		};
		return lib;
	}

	var webrtc;
	var hasRequiredWebrtc;

	function requireWebrtc () {
		if (hasRequiredWebrtc) return webrtc;
		hasRequiredWebrtc = 1;
		requireConfig();

		let RTCPeerConnection, RTCSessionDescription, RTCIceCandidate;

		if (typeof window === 'undefined') {
		    ({ RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = requireLib());
		} else {
		    RTCPeerConnection = window.RTCPeerConnection;
		    RTCSessionDescription = window.RTCSessionDescription;
		    RTCIceCandidate = window.RTCIceCandidate;
		}

		class WebRtcChannel {
		    constructor() {
		        this.configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
		    }

		    initPeerConnection(onIceCandidate, onDataChannel) {
		        this.peerConnection = new RTCPeerConnection(this.configuration);
		        this.peerConnection.onicecandidate = event => onIceCandidate(event.candidate);
		        this.peerConnection.ondatachannel = event => onDataChannel(event.channel);
		    }

		    setDataChannel(channel, ordered) {
		        this.channel = channel;
		        this.dataChannel = this.peerConnection.createDataChannel(channel, { ordered: ordered });
		    }

		    createOffer(onSdp, onError) {
		        this.peerConnection.createOffer(null).then((description) => {
		            this.peerConnection.setLocalDescription(description).catch(onError);
		            onSdp(description.sdp);
		        }).catch(onError);
		    }

		    createAnswer(onSdp, onError) {
		        this.peerConnection.createAnswer().then((description) => {
		            this.peerConnection.setLocalDescription(description).catch(onError);
		            onSdp(description.sdp);
		        }).catch(onError);
		    }

		    addIceCandidate(candidate, onError) {
		        this.peerConnection.addIceCandidate(new RTCIceCandidate({ candidate: candidate, sdpMid: 0, sdpMLineIndex: 0 })).catch(onError);
		    }

		    setRemoteDescription(type, sdp, onError) {
		        this.peerConnection.setRemoteDescription(new RTCSessionDescription({ type: type, sdp: sdp })).catch(onError);
		    }

		    sendData(data) {
		        if (this.dataChannel.readyState !== 'open') {
		            console.error(`Data channel ${this.channel} is not open`);
		            return;
		        }
		        this.dataChannel.send(data);
		    }

		    closeDataChannelAndPeerConnection() {
		        if (this.dataChannel && this.dataChannel.readyState !== 'closed') {
		            this.dataChannel.close();
		        }
		        if (this.peerConnection && this.peerConnection.connectionState !== 'closed') {
		            this.peerConnection.close();
		        }
		    }

		    isDead() {
		        return (this.dataChannel && this.dataChannel.readyState === 'closed') || (this.peerConnection && ['closed', 'disconnected', 'failed'].includes(this.peerConnection.connectionState));
		    }
		}

		webrtc = { WebRtcChannel };
		return webrtc;
	}

	var client$1;
	var hasRequiredClient;

	function requireClient () {
		if (hasRequiredClient) return client$1;
		hasRequiredClient = 1;
		const { IceCandidateData } = requireIce();
		const { RemoteSdpData } = requireSdp();
		const { SimpleDataMessage } = requireSimple();
		const { Signaler } = requireSignaling();
		const { WebRtcChannel } = requireWebrtc();

		async function startWebRtcClient(ch, port, onError, onData) {
		    let success = false;
		    let signaler = new Signaler();
		    let channel = new WebRtcChannel();
		    let onSignalerMessage = (message) => {
		        if (message.channel === ch) {
		            switch (message.data.constructor.TYPE) {
		                case IceCandidateData.TYPE: {
		                    channel.addIceCandidate(message.data.iceCandidate, onError);
		                    break;
		                }
		                case RemoteSdpData.TYPE: {
		                    if (message.data.sdpType === 'answer') {
		                        channel.setRemoteDescription(message.data.sdpType, message.data.sdpCandidate, onError);
		                    } else {
		                        onError(new Error('Unexpected sdp type received: ' + message.data.sdpType));
		                    }
		                    break;
		                }
		            }
		        } else {
		            console.log('Dropped message with different channel: ' + message.channel);
		        }
		    };
		    let onIceCandidate = (candidate) => {
		        if (candidate) {
		            let data = new IceCandidateData(candidate.candidate);
		            let message = new SimpleDataMessage(ch, data);
		            signaler.send(message);
		        }
		    };
		    let onDataChannel = (dataChannel) => {
		        if (dataChannel.label === ch) {
		            console.log(`Data channel ${ch} opened successfully!`);
		            dataChannel.onmessage = (event) => onData(event.data);
		            signaler.disconnect();
		            success = true;
		        } else {
		            console.error('Unexpected data channel: ' + dataChannel.label);
		        }
		    };
		    let onSignalerConnected = () => {
		        channel.createOffer((sdp) => {
		            let data = new RemoteSdpData('offer', sdp);
		            let message = new SimpleDataMessage(ch, data);
		            signaler.send(message);
		        }, onError);
		    };
		    signaler.connect(onSignalerConnected, ':'+port);
		    signaler.setOnReceivedMessage(onSignalerMessage);
		    channel.initPeerConnection(onIceCandidate, onDataChannel);
		    channel.setDataChannel(ch, false);
		    await new Promise((resolve) => {
		        const interval = setInterval(() => {
		            if (success) {
		                clearInterval(interval);
		                resolve();
		            }
		        }, 100);
		    });
		    return channel;
		}

		client$1 = { startWebRtcClient };
		return client$1;
	}

	var clientExports = requireClient();
	var client = /*@__PURE__*/getDefaultExportFromCjs(clientExports);

	return client;

}));
