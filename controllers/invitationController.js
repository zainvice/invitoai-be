const Invitation = require('../models/Invitation');

// Create a new invitation
exports.createInvitation = async (req, res) => {
    try {
        const { name, image, uniqueName, user, template } = req.body;

        // Check if uniqueName already exists
        const existingInvitation = await Invitation.findOne({ uniqueName });
        if (existingInvitation) {
            return res.status(400).json({ error: 'The unique name already exists. Please choose a different one.' });
        }

        const newInvitation = new Invitation({
            name,
            image,
            uniqueName,
            user,
            template,
        });

        const savedInvitation = await newInvitation.save();
        res.status(201).json(savedInvitation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all invitations
exports.getInvitations = async (req, res) => {
    try {
        const invitations = await Invitation.find();
        res.status(200).json(invitations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get an invitation by uniqueName
exports.getInvitationByUniqueName = async (req, res) => {
    try {
        const { uniqueName } = req.params;

        const invitation = await Invitation.findOne({ uniqueName });

        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        res.status(200).json(invitation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an invitation by uniqueName
exports.updateInvitation = async (req, res) => {
    try {
        const { uniqueName } = req.params;
        const updatedData = req.body;

        const updatedInvitation = await Invitation.findOneAndUpdate(
            { uniqueName },
            updatedData,
            { new: true }
        );

        if (!updatedInvitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        res.status(200).json(updatedInvitation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an invitation by uniqueName
exports.deleteInvitation = async (req, res) => {
    try {
        const { uniqueName } = req.params;

        const deletedInvitation = await Invitation.findOneAndDelete({ uniqueName });

        if (!deletedInvitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        res.status(200).json({ message: 'Invitation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get invitations by user
exports.getInvitationsByUser = async (req, res) => {
    try {
        const { user } = req.params;

        const invitations = await Invitation.find({ user });

        if (invitations.length === 0) {
            return res.status(404).json({ message: 'No invitations found for this user' });
        }

        res.status(200).json(invitations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
