function getInstanceJs(parentClass, scriptInterface, addonTriggers, C3) {
  return class extends parentClass {
    constructor(inst, properties) {
      super(inst);

      this.baseValue = 0;
      this.maxValue = 0;
      this.minValue = 0;
      this.clampMode = 0;
      if (properties) {
        this.baseValue = properties[0];
        this.maxValue = properties[1];
        this.minValue = properties[2];
        this.clampMode = properties[3];
      }

      this.percentBuffs = {};
      this.fixedBuffs = {};
      this.lastBuff = "";

      this._StartTicking();
    }

    Release() {
      super.Release();
    }

    SaveToJson() {
      return {
        baseValue: this.baseValue,
        maxValue: this.maxValue,
        minValue: this.minValue,
        percentBuffs: this.percentBuffs,
        fixedBuffs: this.fixedBuffs,
      };
    }

    LoadFromJson(o) {
      this.baseValue = o.baseValue;
      this.maxValue = o.maxValue;
      this.minValue = o.minValue;
      this.percentBuffs = o.percentBuffs;
      this.fixedBuffs = o.fixedBuffs;
    }

    Trigger(method) {
      super.Trigger(method);
      const addonTrigger = addonTriggers.find((x) => x.method === method);
      if (addonTrigger) {
        this.GetScriptInterface().dispatchEvent(new C3.Event(addonTrigger.id));
      }
    }

    GetScriptInterfaceClass() {
      return scriptInterface;
    }

    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    GetTime() {
      return this._runtime.GetGameTime();
    }

    Tick() {
      const time = this.GetTime();
      // remove expired buffs
      Object.keys(this.percentBuffs).forEach((tag) => {
        const buff = this.percentBuffs[tag];
        if (buff.startTime + buff.duration < time) {
          this.lastBuff = tag;
          this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnBuffEnded);
          this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnAnyBuffEnded);
          delete this.percentBuffs[tag];
        }
      });
      Object.keys(this.fixedBuffs).forEach((tag) => {
        const buff = this.fixedBuffs[tag];
        if (buff.startTime + buff.duration < time) {
          this.lastBuff = tag;
          this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnBuffEnded);
          this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnAnyBuffEnded);
          delete this.fixedBuffs[tag];
        }
      });
    }

    // Actions
    _SetValue(value) {
      this.baseValue = this.clamp(value, this.minValue, this.maxValue);
    }
    _SetMax(value) {
      this.maxValue = value;
      this.baseValue = this.clamp(this.baseValue, this.minValue, this.maxValue);
    }
    _SetMin(value) {
      this.minValue = value;
      this.baseValue = this.clamp(this.baseValue, this.minValue, this.maxValue);
    }
    _ApplyPercentBuff(tag, value, duration) {
      this.percentBuffs[tag] = {
        value,
        duration,
        startTime: this.GetTime(),
      };
      this.lastBuff = tag;
      this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnBuffStarted);
      this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnAnyBuffStarted);
    }
    _ApplyFixedBuff(tag, value, duration) {
      this.fixedBuffs[tag] = {
        value,
        duration,
        startTime: this.GetTime(),
      };
      this.lastBuff = tag;
      this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnBuffStarted);
      this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnAnyBuffStarted);
    }
    _StopBuff(tag) {
      this.lastBuff = tag;
      this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnBuffEnded);
      this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnAnyBuffEnded);
      delete this.percentBuffs[tag];
      delete this.fixedBuffs[tag];
    }
    _StopAllBuffs() {
      Object.keys(this.percentBuffs).forEach((tag) => {
        this.lastBuff = tag;
        this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnBuffEnded);
        this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnAnyBuffEnded);
      });
      Object.keys(this.fixedBuffs).forEach((tag) => {
        this.lastBuff = tag;
        this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnBuffEnded);
        this.Trigger(C3.Behaviors.skymen_buffed_value.Cnds.OnAnyBuffEnded);
      });
      this.percentBuffs = {};
      this.fixedBuffs = {};
    }

    // Conditions
    _HasAnyBuff() {
      return (
        Object.keys(this.percentBuffs).length > 0 ||
        Object.keys(this.fixedBuffs).length > 0
      );
    }
    _HasBuff(tag) {
      return this.percentBuffs[tag] || this.fixedBuffs[tag];
    }
    _IsAtMax() {
      return this.baseValue === this.maxValue;
    }
    _IsAtMin() {
      return this.baseValue === this.minValue;
    }
    _OnBuffStarted(tag) {
      return this.lastBuff === tag;
    }
    _OnBuffEnded(tag) {
      return this.lastBuff === tag;
    }
    _OnAnyBuffStarted() {
      return true;
    }
    _OnAnyBuffEnded() {
      return true;
    }
    _ForEachBuff() {}

    // Expressions
    _Value() {
      return this.clampMode === 0
        ? this.clamp(this._RawValue(), this.minValue, this.maxValue)
        : this._RawValue();
    }
    _BaseValue() {
      return this.baseValue;
    }
    _RawValue() {
      return (
        this.baseValue +
        (this.baseValue * this._AllPercentBuffs()) / 100 +
        this._AllFixedBuffs()
      );
    }
    _Max() {
      return this.maxValue;
    }
    _Min() {
      return this.minValue;
    }
    _AllPercentBuffs() {
      let percentBuff = 0;
      Object.keys(this.percentBuffs).forEach((tag) => {
        const buff = this.percentBuffs[tag];
        percentBuff += buff.value;
      });
      return percentBuff;
    }
    _AllFixedBuffs() {
      let fixedBuff = 0;
      Object.keys(this.fixedBuffs).forEach((tag) => {
        const buff = this.fixedBuffs[tag];
        fixedBuff += buff.value;
      });
      return fixedBuff;
    }
    _BuffCount() {
      return (
        Object.keys(this.percentBuffs).length +
        Object.keys(this.fixedBuffs).length
      );
    }
    _BuffTime(tag) {
      const buff = this.percentBuffs[tag] || this.fixedBuffs[tag];
      if (buff) {
        // return remaining duration
        return buff.duration - (this.GetTime() - buff.startTime);
      }
      return 0;
    }
    _FixedBuffValue(tag) {
      const buff = this.fixedBuffs[tag];
      if (buff) {
        return buff.value;
      }
      return 0;
    }
    _PercentBuffValue(tag) {
      const buff = this.percentBuffs[tag];
      if (buff) {
        return buff.value;
      }
      return 0;
    }
    _BuffProgress(tag) {
      const buff = this.percentBuffs[tag] || this.fixedBuffs[tag];
      if (buff) {
        // return progress
        return (this.GetTime() - buff.startTime) / buff.duration;
      }
      return 0;
    }
    _BuffDuration(tag) {
      const buff = this.percentBuffs[tag] || this.fixedBuffs[tag];
      if (buff) {
        return buff.duration;
      }
      return 0;
    }
    _LastBuff() {
      return this.lastBuff;
    }
  };
}
