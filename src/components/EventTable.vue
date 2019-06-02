<template>

    <v-data-table
            :headers="headers"
            :items="events"
            class="elevation-1"
    >
        <template slot="headerCell" slot-scope="props">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
          <span v-on="on">
            {{ props.header.text }}
          </span>
                </template>
                <span>
          {{ props.header.text }}
        </span>
            </v-tooltip>
        </template>
        <template v-slot:items="props">

            <td v-if="editing === props.item.id">
                <input type="text" v-model="props.item.name" />
            </td>
            <td v-else>{{ props.item.name }}</td>

            <td v-if="editing === props.item.id">
                <input type="text" v-model="props.item.description" />
            </td>
            <td class="text-xs-left" v-else>{{ props.item.description }}</td>

            <td v-if="editing === props.item.id">
                <input type="text" v-model="props.item.location" />
            </td>
            <td class="text-xs-left" v-else>{{ props.item.location }}</td>

            <td v-if="editing === props.item.id">
                <input type="text" v-model="props.item.date" />
            </td>
            <td class="text-xs-left" v-else>{{ props.item.date }}</td>

            <td v-if="editing === props.item.id">
                <input type="text" v-model="props.item.maxParticipants" />
            </td>
            <td class="text-xs-left" v-else>{{ props.item.maxParticipants }}</td>

            <td v-if="editing === props.item.id">
                <input type="text" v-model="props.item.host" />
            </td>
            <td class="text-xs-left" v-else>{{ props.item.host }}</td>

            <td v-if="editing === props.item.id">
                <v-btn @click="editEvent(props.item)">Save</v-btn>
                <v-btn class="muted-button" @click="editing = null">Cancel</v-btn>
            </td>
            <td v-else>
                <v-btn @click="editMode(props.item.id)">Edit</v-btn>
                <v-btn @click="$emit('delete:event', props.item.id)">Delete</v-btn>
            </td>
        </template>
    </v-data-table>

</template>

<script>
    export default {
        name: 'event-table',
        props: {
            events: Array,
        },

        data() {
            return {
                editing: null,
                pagination: {
                    sortBy: 'name'
                },
                headers: [
                    {
                        text: 'Name',
                        align: 'left',
                        value: 'name'
                    },
                    { text: 'Description', value: 'description' },
                    { text: 'Location', value: 'location' },
                    { text: 'Date', value: 'date' },
                    { text: 'Max Participants', value: 'maxParticipants' },
                    { text: 'Host', value: 'host' },
                    { text: 'Actions' }
                ],
            }
        },
        methods: {
            editMode(id) {
                this.editing = id
            },
            editEvent(event) {
                if (event.name === '' || event.description === '') return
                this.$emit('edit:event', event.id, event)
                this.editing = null
            },
        }
    }
</script>

<style scoped>
    button {
        margin: 0 0.5rem 0 0;
    }
</style>