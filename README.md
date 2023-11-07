<img src="./src/icon.svg" width="100" /><br>
# Buffable Value <br>
Description <br>
<br>
Author: skymen <br>
<sub>Made using [c3ide2-framework](https://github.com/ConstructFund/c3ide2-framework) </sub><br>

## Table of Contents
- [Usage](#usage)
- [Examples Files](#examples-files)
- [Properties](#properties)
- [Actions](#actions)
- [Conditions](#conditions)
- [Expressions](#expressions)
---
## Usage
To build the addon, run the following commands:

```
npm i
node ./build.js
```

To run the dev server, run

```
npm i
node ./dev.js
```

The build uses the pluginConfig file to generate everything else.
The main files you may want to look at would be instance.js and scriptInterface.js

## Examples Files

---
## Properties
| Property Name | Description | Type |
| --- | --- | --- |
| Value | Value | float |
| Max | Max | float |
| Min | Min | float |
| undefined | undefined | combo |


---
## Actions
| Action | Description | Params
| --- | --- | --- |
| Set value | Set value | Value             *(number)* <br> |
| Set max | Set max | Value             *(number)* <br> |
| Set min | Set min | Value             *(number)* <br> |
| Apply buff | Apply buff | Buff ID             *(string)* <br>Value as a percentage             *(number)* <br>Duration             *(number)* <br> |
| Apply fixed buff | Apply fixed buff | Buff ID             *(string)* <br>Value             *(number)* <br>Duration             *(number)* <br> |
| Stop buff | Stop buff | Buff ID             *(string)* <br> |
| Stop all buffs | Stop all buffs |  |


---
## Conditions
| Condition | Description | Params
| --- | --- | --- |
| Has any buff | Has any buff |  |
| Has buff | Has buff | Buff ID *(string)* <br> |
| Is at max | Is at max |  |
| Is at min | Is at min |  |
| On buff started | On buff started | Buff ID *(string)* <br> |
| On buff ended | On buff ended | Buff ID *(string)* <br> |
| On any buff started | On any buff started |  |
| On any buff ended | On any buff ended |  |
| For each buff | For each buff |  |


---
## Expressions
| Expression | Description | Return Type | Params
| --- | --- | --- | --- |
| Value | Value with all buffs applied | number |  | 
| BaseValue | Base value with no buffs | number |  | 
| RawValue | Raw value with all buffs applied but no min/max clamping | number |  | 
| Max | Max | number |  | 
| Min | Min | number |  | 
| AllPercentBuffs | All percent buffs accumulated | number |  | 
| AllFixedBuffs | All fixed buffs accumulated | number |  | 
| BuffCount | Buff count | number |  | 
| BuffTime | Time | number | Buff ID *(string)* <br> | 
| FixedBuffValue | Value | number | Buff ID *(string)* <br> | 
| PercentBuffValue | Value | number | Buff ID *(string)* <br> | 
| BuffProgress | Progress | number | Buff ID *(string)* <br> | 
| BuffDuration | Duration | number | Buff ID *(string)* <br> | 
| LastBuff | Last buff | string |  | 
